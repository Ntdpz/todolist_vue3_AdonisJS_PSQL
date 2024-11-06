<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 class="text-lg font-bold mb-4">ยืนยันการลบ</h2>
        <p>คุณแน่ใจหรือว่าต้องการลบรายการนี้?</p>
        <div class="flex justify-end mt-4">
          <button @click="confirm" class="bg-red-500 text-white rounded-lg py-2 px-4 hover:bg-red-600 transition duration-200 mr-2">
            ยืนยัน
          </button>
          <button @click="close" class="text-gray-600 hover:text-gray-800 transition duration-200">
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
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm');
      this.close();
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
