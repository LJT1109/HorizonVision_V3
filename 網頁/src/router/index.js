import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Editor from '../views/Editor.vue'
import MediaNodePreview from '../views/MediaNodeEditor.vue'

const routes = [
  {
    path: '/NodeEditor/:node_id',
    name: 'MediaNode',
    component: MediaNodePreview 
  },
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/editor/:scene_id',
    name: 'Editor',
    component: Editor
  },
  {
    path: '/editor/',
    name: 'EditorEmpty',
    component: Editor
  },
  // ...其他路由
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'EditorEmpty' && !to.params.scene_id) {
    // 如果前往 Editor 而且 scene_id 不存在，設定一個預設值
    next({ name: 'Editor', params: { scene_id: '0' } });
  } else {
    next();
  }
});



export default router;
