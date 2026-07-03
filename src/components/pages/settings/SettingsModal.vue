<template>
  <div class="settings-modal-overlay">
    <div class="settings-modal-content">
      <!-- Header berubah tergantung apakah kita lagi di menu utama atau sub-halaman -->
      <div class="settings-modal-header">
        <button v-if="activeSubPage" class="back-icon" @click="activeSubPage = null">
          <font-awesome-icon icon="fa-solid fa-arrow-left" />
        </button>
        <button v-if="!activeSubPage" class="close-icon" @click="$emit('close')">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
        <h2>{{ activeSubPage ? activeSubPage : 'Settings' }}</h2>
      </div>

      <div class="settings-body">
        <!-- Main Menu (Hanya muncul kalau tidak ada subpage yang dipilih) -->
        <nav v-if="!activeSubPage" class="settings-nav">
          <div class="menu-item" @click="activeSubPage = 'Application Settings'">
            <span>Application Settings</span>
            <span class="arrow">></span>
          </div>
          <div class="menu-item" @click="activeSubPage = 'About'">
            <span>About</span>
            <span class="arrow">></span>
          </div>
        </nav>

        <!-- Subpage Content (Hanya muncul kalau ada subpage) -->
        <main v-else class="settings-view">
          <div v-if="activeSubPage === 'Application Settings'">
            <div class="setting-item">
              <label>Theme</label>
              <select>
                <option>Dark (Default)</option>
                <option>Light</option>
              </select>
            </div>
            <div class="setting-item">
              <label>Auto Save</label>
              <input type="checkbox" checked />
            </div>
          </div>
          <AboutView v-else-if="activeSubPage === 'About'" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AboutView from './about/AboutView.vue';
const activeSubPage = ref(null);
</script>

<style scoped>
.settings-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: #252526; /* $sidebar */
  z-index: 9999;
}

.settings-modal-content {
  width: 100%;
  height: 100%;
  background: #252526; /* $sidebar */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.2s ease-out;
}

.settings-modal-header {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #111; /* $br-dark */
  gap: 15px;
}

.settings-modal-header h2 { color: #fff; margin: 0; font-size: 16px; flex: 1; }

.back-icon, .close-icon { background: none; border: none; color: #888; cursor: pointer; font-size: 18px; }

.settings-body {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.menu-item {
  padding: 20px;
  border-bottom: 1px solid #333; /* $border-search */
  display: flex;
  justify-content: space-between;
  color: #fff;
  cursor: pointer;
}

.menu-item:active { background: #37373d; }

.settings-view {
  flex: 1;
  padding: 20px;
  color: #fff;
}

.setting-item {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333; /* $border-search */
  padding-bottom: 10px;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>
