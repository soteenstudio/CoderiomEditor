import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';

import { library } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
  faPen,
  faTrash,
  faBars,
  faFileCode,
  faSave,
  faFolderOpen,
  faFolder,
  faFileCirclePlus,
  faFolderPlus,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faPen,
  faTrash,
  faBars,
  faFileCode,
  faSave,
  faFolderOpen,
  faFolder,
  faFileCirclePlus,
  faFolderPlus
);

const app = createApp(App);

app.use(i18n);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app');
