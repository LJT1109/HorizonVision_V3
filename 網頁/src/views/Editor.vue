<template>
  <div class="MenuBar">
  <!-- <div class="addNodeContainer"> -->

    <MenuBar class="MenuBar"/>
  </div>
  <div class="viewContainer" @mousedown="dragStart">
    <!-- <div >Horizon Vision</div> -->
    <img class="backgroundtitle001" src="/BackgroundTitle001.svg" />
    <div class="viewCanvas" ref="canvaDraggable">
      <div>
        <!-- 在你的 HTML 中 -->


        <div v-for="(node, index) in textNodes" :key="index">
          <TextNode :data-node-index="node.index" :nodeProps="node" :offset="[x, y]" />
        </div>
        <div v-for="(node, index) in imageNodes" :key="index">
          <ImageNode :data-node-index="node.index" :nodeProps="node" :offset="[x, y]" />
        </div>
        <div v-for="(node, index) in videoNodes" :key="index">
          <VideoNode :data-node-index="node.index" :nodeProps="node" :offset="[x, y]" />
        </div>
        <div>
          <!-- <ClickHandle @add-text-node="createTextNode" @add-image-node="createImageNode" @add-video-node="createVideoNode"
            @add-scene="addScene" @get-scene="createTextNodeByDB" /> -->

            <ClickHandle @add-image-node="createImageNode" @add-scene="addScene" @get-scene="createTextNodeByDB" />
          <!-- <button v-component-name="'addScene'">addScene</button>
          <button v-component-name="`getScene${index}`" v-for="(scene, index) in DBHandleStore.sceneList" :key="index">
            {{ scene['name'] + index }}
          </button> -->


          <QRcode />
          <BezierHandle />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TextNode from "../components/TextNode.vue";
import ImageNode from "../components/ImageNode.vue";
import VideoNode from "../components/VideoNode.vue";
import { ref, nextTick, onMounted, watch } from 'vue';
import { TextNodeProps, ImageNodeProps, VideoNodeProps } from "../class/NodeProps";
import ClickHandle from "../components/ClickHandle.vue";
import { useNodeHandleStore } from '../stores/NodeHandle';
import { useDBHandleStore } from '../stores/DBHandle';
import { useGroupHandleStore } from '../stores/GroupHandle';
import BezierHandle from "../components/BezierHandle.vue";
import QRcode from "../components/QRcode.vue";
import { useRouter } from 'vue-router';
import MenuBar from "../components/MenuBar.vue";
import { useRoute } from 'vue-router'

const route = useRoute();
// console.log(route.params.scene_id);



const nodeHandleStore = useNodeHandleStore();
const { addTextNode, clearNodes, addConnection } = nodeHandleStore;
const DBHandleStore = useDBHandleStore();
const { DBNodes, NodesRefresh, scenesID, sceneList, userToken, checkLogin, setNodesByGetPages, getSceneList, addNewScene } = DBHandleStore;
getSceneList();
DBHandleStore.scenesID = route.params.scene_id;
sessionStorage.setItem('sceneid', route.params.scene_id);

import { useApi } from "../composables/UseApi";
const { getScenes } = useApi();
getScenes(DBHandleStore.userToken).then(result => {
    // console.log(" scene:", DBHandleStore.userToken);
    console.log(DBHandleStore.sceneList[DBHandleStore.scenesID]['editToken']);
    setNodesByGetPages(DBHandleStore.sceneList[DBHandleStore.scenesID]['editToken']).then(() => {
      console.log(" page:", DBHandleStore.DBNodes);
      createTextNodeByDB();
    });

  });

const GroupHandleStore = useGroupHandleStore();
const { groups, addGroup,  setHead, getToggleDropdown, clearGroups, showDropdown, selectedItem } = GroupHandleStore;


const textNodes = ref([]);
const imageNodes = ref([]);
const videoNodes = ref([]);

let currentIndex = 0;
const canvaDraggable = ref();
let offsetX, offsetY;
const x = ref(0);
const y = ref(0);

// console.log("Login",DBHandleStore);

const createTextNode = () => {
  currentIndex++;
  console.log(currentIndex);
  const newNode = new TextNodeProps({ index: currentIndex, position: { x: x.value, y: y.value } });
  textNodes.value.push(newNode);
  addTextNode(newNode);
};
const createImageNode = () => {
  currentIndex++;
  console.log(currentIndex);
  const newNode = new ImageNodeProps({ index: currentIndex, position: { x: x.value, y: y.value } });
  imageNodes.value.push(newNode);
  addTextNode(newNode);
};
const createVideoNode = () => {
  currentIndex++;
  console.log(currentIndex);
  const newNode = new VideoNodeProps({ index: currentIndex, position: { x: x.value, y: y.value } });
  videoNodes.value.push(newNode);
  addTextNode(newNode);
};

const addScene = () => {
  const sceneName = prompt("請輸入 scene name:");
  if (sceneName && sceneName.trim() !== "") {  // 檢查輸入是否為空或只有空格
    addNewScene(sceneName);
  } else {
    alert("輸入不得為空");
  }
};


const createTextNodeByDB = async () => {
  console.log("currentIndex", DBHandleStore.DBNodes);

  currentIndex = 0;
  textNodes.value = [];
  imageNodes.value = [];
  videoNodes.value = [];
  clearNodes();
  clearGroups();
  nextTick(() => {
    const filteredGroups = DBHandleStore.DBNodes['groups'].filter(item => Number.isInteger(item) && item > 0);

    for (let i = 0; i < filteredGroups.length; i++) {
      addGroup();
    }
    for (let i = 0; i < DBHandleStore.DBNodes['bodys'].length; i++) {
      console.log("bodys:",DBHandleStore.DBNodes['bodys'][i]);
      const web_id = DBHandleStore.DBNodes['bodys'][i]['web_id'];
      // const content = DBHandleStore.DBNodes['bodys'][i]['content'];
      const content = "https://horizonvision.ljthub.com/bg2/preview/"+DBHandleStore.DBNodes['bodys'][i]['hash']+'.jpg';
      const gid = DBHandleStore.DBNodes['bodys'][i]['groupid'];
      // const type = DBHandleStore.DBNodes['bodys'][i]['type'];
      const type = 'image';
      const head = DBHandleStore.DBNodes['bodys'][i]['head'];
      const positionStr = DBHandleStore.DBNodes['bodys'][i]['position'];
      const [xStr, yStr] = positionStr.split("_");
      const position = { x: parseInt(xStr), y: parseInt(yStr) };
      const nextStr = DBHandleStore.DBNodes['bodys'][i]['next'];
      const nextSet = new Set(nextStr.split("_").filter(Boolean));
      const next = Array.from(nextSet);
      const prevStr = DBHandleStore.DBNodes['bodys'][i]['prev'];
      const prevSet = new Set(prevStr.split("_").filter(Boolean));
      const prev = Array.from(prevSet);
      const hash = DBHandleStore.DBNodes['bodys'][i]['hash'];

      console.log("bodys:",head);
      if (type == "text") {
        const newNode = new TextNodeProps({
          index: web_id,
          position: { x: position.x, y: position.y },
          content: content,
          type: type,
          groupId: gid,
          head: head,
          next: next,
          prev: prev
        });
        textNodes.value.push(newNode);
        console.log(newNode);
        addTextNode(newNode);
      }
      else if (type == "image") {
        const newNode = new ImageNodeProps({
          index: web_id,
          position: { x: position.x, y: position.y },
          content: content,
          type: type,
          groupId: gid,
          head: head,
          next: next,
          prev: prev,
          hash: hash
        });
        imageNodes.value.push(newNode);
        console.log(newNode);
        addTextNode(newNode);
      }
      else if (type == "video") {
        const newNode = new VideoNodeProps({
          index: web_id,
          position: { x: position.x, y: position.y },
          content: content,
          type: type,
          groupId: gid,
          head: head,
          next: next,
          prev: prev
        });
        videoNodes.value.push(newNode);
        console.log(newNode);
        addTextNode(newNode);
      }
      if (parseInt(web_id) > currentIndex) {
        currentIndex = parseInt(web_id);
      }
    }

    // 這裡寫重新渲染後需要執行的代碼
    for (let i = 0; i < DBHandleStore.DBNodes['heads'].length; i++) {
      console.log("heads:",DBHandleStore.DBNodes['heads'][i]);
      const web_id = DBHandleStore.DBNodes['heads'][i]['web_id'];
      // const content = DBHandleStore.DBNodes['heads'][i]['content'];
      const content = "https://horizonvision.ljthub.com/bg2/preview/"+DBHandleStore.DBNodes['heads'][i]['hash']+'.jpg';
      const head = DBHandleStore.DBNodes['heads'][i]['head'];
      const gid = DBHandleStore.DBNodes['heads'][i]['groupid'];
      // const type = DBHandleStore.DBNodes['heads'][i]['type'];
      const type = 'image';
      const positionStr = DBHandleStore.DBNodes['heads'][i]['position'];
      const [xStr, yStr] = positionStr.split("_");
      const position = { x: parseInt(xStr), y: parseInt(yStr) };
      const nextStr = DBHandleStore.DBNodes['heads'][i]['next'];
      const nextSet = new Set(nextStr.split("_").filter(Boolean));
      const next = Array.from(nextSet);
      const prevStr = DBHandleStore.DBNodes['heads'][i]['prev'];
      const prevSet = new Set(prevStr.split("_").filter(Boolean));
      const prev = Array.from(prevSet);     
      const hash = DBHandleStore.DBNodes['heads'][i]['hash'];
     
      if (type == "text") {
        const newNode = new TextNodeProps({
          index: web_id,
          position: { x: position.x, y: position.y },
          content: content,
          type: type,
          groupId: gid,
          head: head,
          next: next,
          prev: prev
        });
        textNodes.value.push(newNode);
        console.log(newNode);   
        addTextNode(newNode);
      }
      else if (type == "image") {
        const newNode = new ImageNodeProps({
          index: web_id,
          position: { x: position.x, y: position.y },
          content: content,
          type: type,
          groupId: gid,
          head: head,
          next: next,
          prev: prev,
          hash: hash
        });
        imageNodes.value.push(newNode);
        console.log(newNode);
        addTextNode(newNode);
      }
      else if (type == "video") {
        const newNode = new VideoNodeProps({
          index: web_id,
          position: { x: position.x, y: position.y },
          content: content,
          type: type,
          groupId: gid,
          head: head,
          next: next,
          prev: prev
        });
        videoNodes.value.push(newNode);
        console.log(newNode);
        addTextNode(newNode);
      }
      setHead(web_id) ; 
      if (parseInt(web_id) > currentIndex) {
        currentIndex = parseInt(web_id);
      }
    }

    textNodes.value.sort((a, b) => a.index - b.index);
    imageNodes.value.sort((a, b) => a.index - b.index);
    videoNodes.value.sort((a, b) => a.index - b.index);
    // ... 現有的 nextTick 回調函數代碼


    nextTick(() => {
          // 遍歷 textNodes 並添加連接
      textNodes.value.forEach((node) => {
        if (node.next != "") {
          node.next.forEach((nextIndex) => {
            addConnection(node.index, nextIndex);
          });
        }
        if (node.prev != "") {
          node.prev.forEach((prevIndex) => {
            addConnection(prevIndex, node.index);
          });
        }
      });
      // 遍歷 imageNodes 並添加連接
      imageNodes.value.forEach((node) => {
        if (node.next != "") {
          node.next.forEach((nextIndex) => {
            addConnection(node.index, nextIndex);
          });
        }
        if (node.prev != "") {
          node.prev.forEach((prevIndex) => {
            addConnection(prevIndex, node.index);
          });
        }
      });

      // 遍歷 videoNodes 並添加連接
      videoNodes.value.forEach((node) => {
        if (node.next != "") {
          node.next.forEach((nextIndex) => {
            addConnection(node.index, nextIndex);
          });
        }
        if (node.prev != "") {
          node.prev.forEach((prevIndex) => {
            addConnection(prevIndex, node.index);
          });
        }
      });
    });


    // ... 現有的 nextTick 回調函數代碼

  });
  console.log("connections:",nodeHandleStore.connections);
  DBHandleStore.NodesRefresh = true;
};

const dragStart = (e) => {

  if (e.target.className != 'viewCanvas' && e.target.className != 'viewContainer') {
    return;
  }
  offsetX = e.clientX - canvaDraggable.value.getBoundingClientRect().left;
  offsetY = e.clientY - canvaDraggable.value.getBoundingClientRect().top;
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);
};

const drag = (e) => {
  let newX = e.clientX - offsetX;
  let newY = e.clientY - offsetY;
  newX = Math.min(0, newX);
  newY = Math.min(0, newY);
  x.value = newX;
  y.value = newY;

  // console.log(x.value, y.value);
  canvaDraggable.value.style.left = `${x.value}px`;
  canvaDraggable.value.style.top = `${y.value}px`;
};

const dragEnd = () => {
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', dragEnd);
};

onMounted(async () => {
  if (!DBHandleStore.checkLogin) {
    router.push('/');
  }
  // console.log("edior mounted");
});


</script>

<style >
.viewContainer {
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  overflow: hidden;
  text-align: center;
  background-color: var(--color-aliceblue-200);
  font-size: 128px;
  font-family: var(--font-zen-dots);
}

.viewCanvas {
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
}

.backgroundtitle001 {
  position: relative;
  top: 40%;
  left: 0%;
  color: #c5c7c963;
  text-shadow: 10px 10px 10px rgba(255, 255, 255, 0.3),
    -10px -10px 10px rgba(215, 218, 224, 0.5);
  pointer-events: none;
  user-select: none;-webkit-user-select: none;
}

.MenuBar {
  display: flex;
  justify-content: center; /* 橫向居中 */
  align-items: center; /* 垂直居中 */
  position: absolute; /* 絕對定位 */
  left: 0%;
  bottom: 5%; /* 距離底部10% */
  width: 100%; /* 寬度為100% */
  z-index: 9999; /* 顯示在最上層 */
}

</style>