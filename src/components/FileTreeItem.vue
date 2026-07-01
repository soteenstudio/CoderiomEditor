<template>
  <div class="tree-item">
    <!-- Jika Folder -->
    <div v-if="item.type === 'directory'" class="folder-group">
      <div
        class="item-folder row-item"
        :class="{ 'folder-selected': item.id === selectedFolder }"
        @click.stop="$emit('click-folder', item.id)"
      >
        <div class="item-info">
          <span class="icon">
            <font-awesome-icon :icon="isOpen ? 'folder-open' : 'folder'" />
          </span>
          <span class="name">{{ item.name }}</span>
        </div>
        <button class="menu-trigger" @click.stop="$emit('open-menu', item)">
          ⋮
        </button>
      </div>

      <!-- REKURSI: Panggil diri sendiri kalau folder dibuka -->
      <div
        v-if="isOpen && item.children"
        class="folder-children"
        style="padding-left: 15px"
      >
        <FileTreeItem
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          :active-id="activeId"
          :selected-folder="selectedFolder"
          :opened-folders="openedFolders"
          @click-folder="(id) => $emit('click-folder', id)"
          @select-file="(id) => $emit('select-file', id)"
          @open-menu="(item) => $emit('open-menu', item)"
        />
      </div>
    </div>

    <!-- Jika File -->
    <div
      v-else
      class="item-file row-item"
      :class="{ active: item.id === activeId }"
      @click.stop="$emit('select-file', item.id)"
    >
      <div class="item-info">
        <span class="icon">
          <font-awesome-icon icon="fa-solid fa-file-code" />
        </span>
        <span class="name">{{ item.name }}</span>
      </div>
      <button class="menu-trigger" @click.stop="$emit('open-menu', item)">
        ⋮
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileTreeItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    activeId: {
      type: String,
      required: true,
    },
    selectedFolder: {
      type: String,
      default: '',
    },
    openedFolders: {
      type: Object,
      required: true,
    },
  },
  emits: ['click-folder', 'select-file', 'open-menu'],
  computed: {
    isOpen() {
      return !!this.openedFolders[this.item.id];
    },
  },
};
</script>
