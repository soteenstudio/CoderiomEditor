import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';

import { library } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
  faXmark,
  faPen,
  faTrash,
  faBars,
  faFileCode,
  faSave,
  faFolderOpen,
  faFolder,
  faFileCirclePlus,
  faFolderPlus,
  faPlug,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faXmark,
  faPen,
  faTrash,
  faBars,
  faFileCode,
  faSave,
  faFolderOpen,
  faFolder,
  faFileCirclePlus,
  faFolderPlus,
  faPlug,
  faEllipsisVertical
);

const app = createApp(App);

app.use(i18n);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app');
