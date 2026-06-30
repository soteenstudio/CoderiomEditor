<!-- src/components/Modal.vue -->
<template>
  <div v-if="show" class="context-overlay" @click.stop="closeModal">
    <div class="context-menu" @click.stop>
      <div class="menu-header">
        {{ title }}
      </div>

      <div class="modal-body">
        {{ message }}
      </div>

      <div v-if="type === 'prompt'" class="modal-body">
        <input
          v-model="internalValue"
          class="modal-input"
          placeholder="Nama..."
        />
      </div>

      <div class="modal-actions">
        <button
          v-if="type === 'confirm'"
          class="menu-item secondary"
          @click="handleAction('cancel')"
        >
          {{ t('button:cancel-confirm') }}
        </button>
        <button
          class="menu-item"
          :class="type === 'confirm' ? 'delete' : 'primary'"
          @click="handleAction('ok')"
        >
          {{ type === 'confirm' ? t('button:delete-confirm') : t('button:ok-confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Modal',
    },
    placeholder: {
      type: String,
      default: 'placeholder',
    },
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'alert',
    },
  },
  emits: ['close', 'confirm', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const internalValue = ref('');
    const handleAction = (action) => {
      if (action === 'ok') emit('confirm', internalValue.value);
      else emit('cancel');
      internalValue.value = '';
      emit('close');
    };
    return { handleAction, internalValue, t };
  },
};
</script>

<style scoped>
/* Gunakan Overlay dari ContextMenu biar sama persis */
.context-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Gunakan class context-menu biar style-nya sama */
.context-menu {
  background: #1e1e1e;
  border: 1px solid #454545;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  min-width: 250px;
  max-width: 300px;
  padding: 4px 0;
}

.menu-header {
  padding: 10px 16px;
  font-size: 12px;
  color: #888;
  border-bottom: 1px solid #333;
  margin-bottom: 4px;
}

.modal-body {
  padding: 10px 16px;
  color: #cccccc;
  font-size: 13px;
}

.modal-input {
  width: 100%;
  background: #121212;
  border: 1px solid #454545;
  color: white;
  padding: 8px;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
  gap: 8px;
}

/* Reuse menu-item biar hover-nya sama */
.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  color: #cccccc;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #454545;
  background: #2a2d2e;
  border-radius: 4px;
}

.menu-item:hover {
  color: #ffffff;
  background: #3a3d3e;
}
.menu-item.delete:hover {
  background: #a82020;
  border-color: #a82020;
}
.menu-item.secondary {
  background: #333;
}
.menu-item.primary {
  background: #007acc;
  border-color: #007acc;
  color: white;
}
</style>
