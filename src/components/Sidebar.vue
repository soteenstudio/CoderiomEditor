<!-- src/components/Sidebar.vue -->
<template>
  <div class="sidebar-wrapper">
    <!-- Activity Bar -->
    <div class="activity-bar">
      <div class="activity-item active" title="Explorer">
        <span class="act-icon">
          <font-awesome-icon icon="fa-solid fa-folder" />
        </span>
      </div>
      <div class="activity-item" title="Addons">
        <span class="act-icon">
          <font-awesome-icon icon="fa-solid fa-plug" />
        </span>
      </div>
    </div>

    <!-- Container Utama Explorer -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span>{{ t('title:explorer') }}</span>
        <button
          class="close-btn"
          title="Tutup Sidebar"
          @click="$emit('toggle-sidebar')"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
      </div>

      <div class="sidebar-actions">
        <button @click="triggerCreate('file')">
          <font-awesome-icon icon="fa-solid fa-file-circle-plus" />
        </button>
        <button @click="triggerCreate('folder')">
          <font-awesome-icon icon="fa-solid fa-folder-plus" />
        </button>
      </div>

      <div class="file-tree" @click.self="selectedFolder = ''">
        <div class="tree-container">
          <div v-for="item in items" :key="item.id" class="tree-item">
            <!-- Render Folder Root -->
            <div v-if="item.type === 'directory'" class="folder-group">
              <div
                class="item-folder row-item"
                :class="{ 'folder-selected': item.id === selectedFolder }"
                @click.stop="clickFolder(item.id)"
              >
                <div class="item-info">
                  <span class="icon">
                    <font-awesome-icon
                      :icon="isFolderOpen(item.id) ? 'folder-open' : 'folder'"
                    />
                  </span>
                  <span class="name">{{ item.name }}</span>
                </div>
                <button class="menu-trigger" @click.stop="openMenu(item)">
                  ⋮
                </button>
              </div>

              <!-- Render Anak di dalam Folder -->
              <div
                v-if="isFolderOpen(item.id) && item.children"
                class="folder-children"
                style="padding-left: 15px"
              >
                <div v-for="child in item.children" :key="child.id">
                  <!-- Sub-folder -->
                  <div
                    v-if="child.type === 'directory'"
                    class="item-folder row-item"
                    :class="{ 'folder-selected': child.id === selectedFolder }"
                    @click.stop="clickFolder(child.id)"
                  >
                    <div class="item-info">
                      <span class="icon">
                        <font-awesome-icon
                          :icon="
                            isFolderOpen(item.id) ? 'folder-open' : 'folder'
                          "
                        />
                      </span>
                      <span class="name">{{ child.name }}</span>
                    </div>
                    <button class="menu-trigger" @click.stop="openMenu(child)">
                      ⋮
                    </button>
                  </div>

                  <!-- File di dalam folder -->
                  <div
                    v-else
                    class="item-file row-item"
                    :class="{ active: child.id === activeId }"
                    @click.stop="$emit('select-file', child.id)"
                  >
                    <div class="item-info">
                      <span class="icon">
                        <font-awesome-icon icon="fa-solid fa-file-code" />
                      </span>
                      <span class="name">{{ child.name }}</span>
                    </div>
                    <button class="menu-trigger" @click.stop="openMenu(child)">
                      ⋮
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Render File Root -->
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
              <button class="menu-trigger" @click.stop="openMenu(item)">
                ⋮
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Panggil Komponen Reusable Context Menu -->
    <ContextMenu
      v-if="menuState.show"
      :show="menuState.show"
      :title="menuState.targetItem ? menuState.targetItem.name : 'Unknown'"
      :options="menuOptions"
      @close="menuState.show = false"
      @action="handleMenuAction"
    />

    <!-- Panggil Modal di paling bawah sebelum tutup div wrapper -->
    <Modal
      :show="modalState.show"
      :title="modalState.title"
      :message="modalState.message"
      :type="modalState.type"
      @close="modalState.show = false"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import ContextMenu from './ContextMenu.vue';
import Modal from './Modal.vue';

export default {
  components: { ContextMenu, Modal },
  props: {
    items: { type: Array, required: true },
    activeId: { type: String, required: true },
  },
  emits: [
    'toggle-sidebar',
    'create-file',
    'create-folder',
    'select-file',
    'explore-folder',
    'rename-item',
    'delete-item',
  ],
  setup(props, { emit }) {
    const openedFolders = ref({});
    const selectedFolder = ref('');
    const { t } = useI18n();

    const currentAction = ref('');

    const handleConfirm = (name) => {
      if (currentAction.value === 'file')
        emit('create-file', selectedFolder.value, name);
      if (currentAction.value === 'folder')
        emit('create-folder', selectedFolder.value, name);
      if (currentAction.value === 'rename')
        emit('rename-item', menuState.targetItem.id, name);

      if (currentAction.value === 'delete') performDelete();
    };

    const triggerCreate = (type) => {
      const file = t('new-file');
      const folder = t('new-folder');
      const title = type === 'file' ? file : folder;
      currentAction.value = type;
      showModal('prompt', title, '');
    };

    const menuState = reactive({
      show: false,
      targetItem: null,
    });

    const modalState = reactive({
      show: false,
      title: '',
      message: '',
      type: 'alert',
    });

    const showModal = (type, title, message) => {
      modalState.type = type;
      modalState.title = title;
      modalState.message = message;
      modalState.show = true;
    };

    const performDelete = () => {
      if (menuState.targetItem) {
        emit('delete-item', menuState.targetItem.id, menuState.targetItem.type);
      }
    };

    const openMenu = (item) => {
      menuState.targetItem = item;
      menuState.show = true;
    };

    const clickFolder = (folderPath) => {
      selectedFolder.value = folderPath;
      openedFolders.value[folderPath] = !openedFolders.value[folderPath];

      if (openedFolders.value[folderPath]) {
        emit('explore-folder', folderPath);
      }
    };

    const isFolderOpen = (folderPath) => {
      return !!openedFolders.value[folderPath];
    };

    const handleMenuAction = (actionType) => {
      if (!menuState.targetItem) return;

      if (actionType === 'rename') {
        const item = menuState.targetItem;
        const title = t('title:rename-filename');
        const message = t('rename-filename').replace(/\#\[name\]/, item.name);
        currentAction.value = 'rename';
        showModal('prompt', title, message);
      } else if (actionType === 'delete') {
        const item = menuState.targetItem;
        const title = t('title:delete-confirm');
        const message = t('delete-confirm').replace(/\#\[name\]/, item.name);
        currentAction.value = 'delete';
        showModal('confirm', title, message);
      }
    };

    const renameBtn = t('button:rename');
    const deleteBtn = t('button:delete');
    const menuOptions = [
      { id: 'rename', label: renameBtn, icon: 'pen', danger: false },
      { id: 'delete', label: deleteBtn, icon: 'trash', danger: true },
    ];

    return {
      selectedFolder,
      clickFolder,
      isFolderOpen,
      menuState,
      openMenu,
      handleMenuAction,
      menuOptions,
      modalState,
      showModal,
      triggerCreate,
      handleConfirm,
      t,
    };
  },
};
</script>

<style scoped>
.folder-selected {
  background-color: rgba(0, 122, 204, 0.2) !important;
  outline: 1px dashed #007acc;
}
.row-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
}
.item-info {
  display: flex;
  align-items: center;
  gap: 6px;
}
.menu-trigger {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  padding: 0 4px;
}
.row-item:hover .menu-trigger {
  opacity: 1;
}
</style>
