<template>
  <nav class="navbar">
    <button
      v-if="!isSidebarOpen"
      class="hamburger-btn"
      title="Buka Sidebar"
      @click="$emit('open-sidebar')"
    >
      <font-awesome-icon icon="fa-solid fa-bars" />
    </button>

    <p class="project-title">{{ fileName }}</p>

    <button class="menu-btn" title="Menu">
      <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
    </button>
  </nav>
</template>

<script>
export default {
  props: {
    isSidebarOpen: Boolean,
    fileName: { type: String, default: 'Unknown' },
  },
  emits: ['open-sidebar'],
};
</script>
