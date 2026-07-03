<!-- components/AboutView.vue -->
<template>
  <div class="about-container">
    <div class="about-header">
      <h2>{{ t('app:name') }}</h2>
      <p class="version">{{ t('app:version', { version: version }) }}</p>
    </div>
    
    <div class="info-block">
      <p>{{ t('app:license') }}<strong>Apache-2.0</strong></p>
      <a href="#" class="link-btn">{{ t('app:view-license') }}</a>
    </div>
  
    <div class="tech-stack">
      <div>
        <strong>{{ t('app:powered-by') }}</strong>
        <ul>
          <li>Vue 3</li>
          <li>CodeMirror 6</li>
          <li>TypeScript 6</li>
          <li>Capacitor 8</li>
        </ul>
      </div>
    </div>
  
    <div class="links">
      <button class="action-btn">GitHub</button>
      <button class="action-btn">{{ t('app:documentation') }}</button>
    </div>
    
    <p class="copyright">© 2026 Your Studio Name. All rights reserved.</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { name, version } from '../../../../../package.json';
const { t } = useI18n();
</script>

<style scoped>
.about-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #ccc;
  font-size: 14px;
}

.about-header h2 {
  font-size: 20px;
  color: #fff;
  margin: 0 0 5px 0;
}

.version {
  font-size: 12px;
  color: #888;
}

.info-block, .tech-stack {
  padding: 15px;
  background: #2d2d2d;
  border-radius: 4px;
  border: 1px solid #333;
}

.tech-stack ul {
  list-style: none; /* Buang titik-titik (bullets) */
  padding: 0;       /* Buang padding bawaan browser */
  margin: 10px 0 0 0;
}

.tech-stack li {
  margin-bottom: 4px;
  font-size: 13px;
  color: #bbb;
}

/* Biar teks "Powered by" sama list-nya tetep nyatu */
.tech-stack {
  display: flex;
  flex-direction: column;
}

.link-btn {
  color: #4a9eff;
  text-decoration: none;
  font-size: 13px;
}

.link-btn:hover { text-decoration: underline; }

.links {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: #3c3c3c;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.action-btn:hover { background: #505050; }

.copyright {
  font-size: 11px;
  color: #666;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #333;
}
</style>
