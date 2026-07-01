<template>
  <!-- Hapus v-if="isOpen" atau ganti jadi v-if="true" (atau hapus saja) -->
  <div class="modal-overlay" @click="$emit('close')">
    
    <!-- Box Settings -->
    <div class="modal-content" @click.stop>
      <h2>Settings</h2>
      <p>Isi pengaturan kamu di sini...</p>
      <button @click="$emit('close')">Tutup</button>
    </div>
    
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999; /* Pastikan di atas sidebar */
  display: flex;
  align-items: flex-end; /* Nempel ke bawah */
}

.modal-content {
  width: 100%;
  height: 80%; /* Bisa atur seberapa tinggi munculnya */
  background: #252526;
  border-radius: 12px 12px 0 0;
  padding: 20px;
  animation: slideUp 0.3s ease-out; /* Animasi muncul */
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
