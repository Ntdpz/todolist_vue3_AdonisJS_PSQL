<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 class="text-lg font-bold mb-4">แก้ไขงาน</h2>
        <input
          v-model="updatedText"
          type="text"
          class="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
        <div class="flex justify-end mt-4">
          <button
            @click="save"
            class="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition duration-200 mr-2"
          >
            บันทึก
          </button>
          <button
            @click="close"
            class="text-gray-600 hover:text-gray-800 transition duration-200"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    currentText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      updatedText: this.currentText,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async save() {
      try {
        const response = await fetch(
          `http://localhost:3333/todos/${this.$parent.currentTodoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: this.updatedText,
              status: "pending", // สมมติว่า status ยังไม่เปลี่ยน
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update todo.");
        }

        const updatedTodoFromAPI = await response.json();

        this.$parent.updateTodo(this.updatedText); // เรียกฟังก์ชันใน parent component
        this.$emit("save", this.updatedText);
        this.close();
      } catch (error) {
        console.error(error);
        this.$parent.showNotification("ไม่สามารถบันทึกข้อมูลได้");
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}
</style>
