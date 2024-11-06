<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-3xl font-bold mb-6 text-gray-800 text-center">
        Todo List
      </h1>
      <form @submit.prevent="addTodo" class="mb-4">
        <div class="flex flex-col md:flex-row items-center">
          <input
            v-model="newTodo"
            type="text"
            placeholder="เพิ่มงานใหม่..."
            :class="{
              'border-red': isInputError,
              'border-gray-300': !isInputError,
              'placeholder-red': isInputError,
              border: true,
              'rounded-lg': true,
              'p-2': true,
              'w-full': true,
              'focus:outline-none': true,
              'focus:ring': true,
              'focus:ring-blue-200': true,
              transition: true,
              'duration-200': true,
              'md:mr-3': true,
              'md:mb-0': true,
              'mb-3': true,
            }"
            @focus="clearInputError"
          />

          <button
            type="submit"
            class="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition duration-200"
          >
            เพิ่ม
          </button>
        </div>
      </form>

      <ul class="space-y-2">
        <li
          v-for="(todo, index) in todos"
          :key="todo.id"
          class="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm transition duration-200 hover:bg-gray-200"
        >
          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="todo.completed"
              @change="updateTodoStatus(todo)"
              class="mr-2"
            />
            <span
              :class="{ 'line-through text-gray-400': todo.completed }"
              class="text-gray-700"
            >
              {{ todo.text }}
            </span>
          </div>
          <div class="flex items-center">
            <button
              @click="openEditDialog(todo)"
              class="text-blue-500 hover:text-blue-700 transition duration-200 mr-2"
            >
              แก้ไข
            </button>

            <button
              @click="openConfirmDialog(todo.id)"
              class="text-red-500 hover:text-red-700 transition duration-200"
            >
              <i class="fas fa-trash"></i> ลบ
            </button>
          </div>
        </li>
      </ul>
      <EditDialog
        :isOpen="isEditDialogOpen"
        :currentText="currentTodoText"
        @close="closeEditDialog"
        @save="updateTodo"
      />
      <ConfirmDialog
        :isOpen="isConfirmDialogOpen"
        @close="closeConfirmDialog"
        @confirm="deleteTodoFromAPI"
      />
      <NotificationDialog
        :isOpen="isNotificationOpen"
        :message="notificationMessage"
        @close="closeNotification"
      />
    </div>
  </div>
</template>

<script>
import EditDialog from "./components/EditDialog.vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";
import NotificationDialog from "./components/NotificationDialog.vue";

export default {
  components: {
    EditDialog,
    ConfirmDialog,
    NotificationDialog,
  },
  data() {
    return {
      newTodo: "",
      todos: [], // รายการของงาน
      isEditDialogOpen: false,
      currentTodoIndex: null,
      currentTodoText: "",
      isConfirmDialogOpen: false,
      currentTodoId: null,
      isNotificationOpen: false,
      notificationMessage: "สร้างสำเร็จ!",
      isInputError: false,
      selectAll: false, // ตัวแปรใหม่เพื่อจัดการสถานะการเลือกทั้งหมด
    };
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
    // ฟังก์ชันดึงข้อมูล todos จาก API
    async fetchTodos() {
      try {
        const response = await fetch("http://localhost:3333/todos");
        if (!response.ok) {
          throw new Error("Failed to fetch todos.");
        }
        const todosFromAPI = await response.json();
        this.todos = todosFromAPI.map((todo) => ({
          id: todo.id,
          text: todo.title,
          completed: todo.status === "completed",
        }));
      } catch (error) {
        console.error(error);
        this.showNotification("ไม่สามารถดึงข้อมูลรายการงานได้");
      }
    },

    // ฟังก์ชันสำหรับเพิ่มงานใหม่
    async addTodo() {
      if (this.newTodo.trim() === "") {
        this.isInputError = true;
        this.shakeInput();
        return;
      }
      try {
        const response = await fetch("http://localhost:3333/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: this.newTodo,
            status: "pending",
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to add todo.");
        }
        const newTodoFromAPI = await response.json();
        this.todos.push({
          id: newTodoFromAPI.id,
          text: newTodoFromAPI.title,
          completed: newTodoFromAPI.status === "completed",
        });
        this.newTodo = ""; // Clear the input
        this.showNotification("สร้างสำเร็จ!"); // แสดง Notification
      } catch (error) {
        console.error(error);
        this.showNotification("มีข้อผิดพลาดในการเพิ่มงาน");
      }
    },

    // ฟังก์ชันอัปเดตสถานะของ todo ใน API
    async updateTodoStatus(todo) {
      try {
        const updatedStatus = todo.completed ? "completed" : "pending";
        const response = await fetch(`http://localhost:3333/todos/${todo.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: todo.text,
            status: updatedStatus,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to update todo status.");
        }
        const updatedTodoFromAPI = await response.json();
        todo.completed = updatedTodoFromAPI.status === "completed"; // อัปเดตสถานะในหน้าจอ
      } catch (error) {
        console.error(error);
        this.showNotification("ไม่สามารถอัปเดตสถานะงานได้");
      }
    },

    // ฟังก์ชันแสดงการแจ้งเตือน
    showNotification(message) {
      this.notificationMessage = message;
      this.isNotificationOpen = true;
      setTimeout(this.closeNotification, 3000);
    },
    closeNotification() {
      this.isNotificationOpen = false;
    },
    openEditDialog(todo) {
      this.currentTodoId = todo.id;
      this.currentTodoText = todo.text;
      this.isEditDialogOpen = true;
    },
    closeEditDialog() {
      this.isEditDialogOpen = false;
    },
    // เมื่อบันทึกการแก้ไขใน EditDialog
    async updateTodo(updatedText) {
      if (updatedText && updatedText.trim() !== "") {
        try {
          const response = await fetch(
            `http://localhost:3333/todos/${this.currentTodoId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: updatedText,
                status: "pending", // สมมติว่า status ยังคงไม่เปลี่ยน
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update todo.");
          }

          const updatedTodoFromAPI = await response.json();

          // ค้นหาด้วย todo.id และอัปเดตข้อมูล text
          const todoIndex = this.todos.findIndex(
            (todo) => todo.id === this.currentTodoId
          );
          if (todoIndex !== -1) {
            this.todos[todoIndex].text = updatedTodoFromAPI.title;
          } else {
            throw new Error("Todo not found");
          }

          this.showNotification("อัปเดตงานสำเร็จ!");
          this.closeEditDialog(); // ปิด dialog หลังจากอัปเดตสำเร็จ
        } catch (error) {
          console.error(error);
          this.showNotification("ไม่สามารถอัปเดตข้อมูลได้");
        }
      }
    },

    // ฟังก์ชันสำหรับลบ todo item จาก API
    async deleteTodoFromAPI() {
      try {
        const response = await fetch(
          `http://localhost:3333/todos/${this.currentTodoId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete todo.");
        }
        // หลังจากลบสำเร็จให้ลบ todo จาก list
        this.todos = this.todos.filter(
          (todo) => todo.id !== this.currentTodoId
        );
        this.closeConfirmDialog(); // ปิด ConfirmDialog หลังจากลบสำเร็จ
        this.showNotification("ลบสำเร็จ!"); // แสดงการแจ้งเตือน
      } catch (error) {
        console.error(error);
        this.showNotification("ไม่สามารถลบรายการงานได้");
      }
    },
    openConfirmDialog(id) {
      this.currentTodoId = id;
      this.isConfirmDialogOpen = true;
    },
    closeConfirmDialog() {
      this.isConfirmDialogOpen = false;
    },

    toggleSelectAll() {
      this.todos.forEach((todo) => {
        todo.completed = this.selectAll; // ตั้งค่าสถานะ completed ตาม selectAll
      });
    },
  },
};
</script>
