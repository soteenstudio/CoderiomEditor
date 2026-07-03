<template>
  <div class="sidebar-header">
    <span><slot name="title" /></span>

    <button class="close-btn" title="Tutup Sidebar" @click="$emit('close')">
      <font-awesome-icon icon="fa-solid fa-xmark" />
    </button>
  </div>
</template>

<script>
export default {
  emits: ['close'],
};
</script>
