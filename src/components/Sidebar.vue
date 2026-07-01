<!-- src/components/Sidebar.vue -->
<template>
  <div class="sidebar-wrapper">
    <ActivityBar
      :model-value="activeTab"
      @update:model-value="activeTab = $event" 
    />

    <aside class="sidebar">
      <Explorer
        v-if="activeTab === 'explorer'"
        :items="items"
        :active-id="activeId"
        :selected-folder="selectedFolder"
        @click-folder="(path) => (selectedFolder = path)"
        @trigger-create="handleTriggerCreate"
        @select-file="(id) => $emit('select-file', id)"
        @open-menu="openMenu"
        @explore-folder="(path) => $emit('explore-folder', path)"
        @toggle-sidebar="$emit('toggle-sidebar')"
      />

      <Addons
        v-if="activeTab === 'addons'"
        @toggle-sidebar="$emit('toggle-sidebar')"
      />
    </aside>

    <ContextMenu
      v-if="menuState.show"
      :show="menuState.show"
      :title="menuState.targetItem ? menuState.targetItem.name : 'Unknown'"
      :options="menuOptions"
      @close="menuState.show = false"
      @action="handleMenuAction"
    />

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
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ActivityBar from './ActivityBar.vue';
import ContextMenu from './ContextMenu.vue';
import Explorer from './Explorer.vue';
import Addons from './Addons.vue';
import Modal from './Modal.vue';

export default {
  components: { ActivityBar, ContextMenu, Explorer, Addons, Modal },
  props: {
    modelValue: { type: String, required: true },
    items: { type: Array, required: true },
    activeId: { type: String, required: true },
  },
  emits: [
    'update:modelValue',
    'toggle-sidebar',
    'create-file',
    'create-folder',
    'select-file',
    'explore-folder',
    'rename-item',
    'delete-item',
  ],
  setup(props, { emit }) {
    const selectedFolder = ref('');
    const { t } = useI18n();

    const activeTab = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val)
    });

    const currentAction = ref('');

    const switchTab = (tab) => {
      activeTab.value = tab;
    };

    const handleConfirm = (name) => {
      if (currentAction.value === 'file')
        emit('create-file', selectedFolder.value, name);
      if (currentAction.value === 'folder')
        emit('create-folder', selectedFolder.value, name);
      if (currentAction.value === 'rename')
        emit('rename-item', menuState.targetItem.id, name);

      if (currentAction.value === 'delete') performDelete();
    };

    const handleTriggerCreate = (type, folderPath) => {
      selectedFolder.value = folderPath;

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
      activeTab,
      switchTab,
      menuState,
      openMenu,
      handleMenuAction,
      menuOptions,
      modalState,
      showModal,
      handleConfirm,
      handleTriggerCreate,
      selectedFolder,
      t,
    };
  },
};
</script>
