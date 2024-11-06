<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-sm transform transition-transform duration-200 scale-100"
      >
        <h2 class="text-lg font-bold mb-4">การแจ้งเตือน</h2>
        <p>{{ message }}</p>
        <div class="flex justify-end mt-4"></div>
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
    message: {
      type: String,
      default: "สำเร็จ!",
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        setTimeout(this.close, 600); // ปิดหลัง 0.45 วินาที
      }
    },
  },
};
</script>
  
  <style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.fade-enter {
  transform: scale(0.8);
}
.fade-enter-active {
  transform: scale(1);
}
.fade-leave {
  transform: scale(1);
}
.fade-leave-active {
  transform: scale(0.8);
}
</style>
  