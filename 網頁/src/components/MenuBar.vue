<template>
  <!-- <span class="container" draggable="false" style="width: auto;left: 40%;"> -->
    <span class="container" draggable="false" >
    <div class="menu-bar-wrapper">
      <div class="menu-bar">
        <span
          v-component-name="`getScene${index}`"
          v-for="(scene, index) in DBHandleStore.sceneList"
          :key="index"
          @mouseover="showTooltip(index)"
          @mouseout="hideTooltip"
        >  
        <img 
          class="menu-button" 
          :class="{ 'selected': index == DBHandleStore.scenesID }"
          :src="index == DBHandleStore.scenesID ? '/menuBar/SceneButton001-Selected.svg' : '/menuBar/SceneButton001.svg'" 
          :alt="`Scene ${index}`" 
        />
          <div v-if="tooltipIndex === index" class="tooltip">{{ scene['name'] }}</div>
        </span>
        <span 
          class="addScene" 
          v-component-name="'addScene'"           
          @mouseover="showTooltip('新增場景')"
          @mouseout="hideTooltip"
        >
          <img class="normal-icon" :src="getIconSrc('')" />
          <img class="hover-icon" :src="getIconSrc('-Hover')" />
          <img class="press-icon" :src="getIconSrc('-Click')" />          

        </span>

        <div v-if="tooltipIndex === '新增場景'" class="tooltip">{{ tooltipIndex }}</div>

      </div>
    </div>
    <div class="add-node-wrapper " v-if="DBHandleStore.scenesID != -1" draggable="false">
      <!-- <AddNode :buttonName="'AddTextNode'" @mouseover="showTooltip('新增文字節點')" @mouseout="hideTooltip"/> -->
      <AddNode :buttonName="'AddImageNode'" @mouseover="showTooltip('新增圖片節點')" @mouseout="hideTooltip" />
      <!-- <AddNode :buttonName="'AddVideoNode'" @mouseover="showTooltip('新增影片節點')" @mouseout="hideTooltip" /> -->
    <div class="menu-item-wraper" draggable="false">
      <div
          class="menu-item"
          v-for="button in menuButtons"
          :key="button.name"
          @mouseover="showTooltip(button.tooltip)"
          @mouseout="hideTooltip"
          v-component-name="button.name"
        >
          <img :class="button.name" :src="getQRIconSrc(button.name, '')" />
          <img :class="button.name + '-hover'" :src="getQRIconSrc(button.name, '-hover')" />
          <img :class="button.name + '-click'" :src="getQRIconSrc(button.name, '-click')" />
          
      </div>
    </div>
      <div v-if="tooltipIndex === '新增文字節點'" class="tooltip">{{ tooltipIndex }}</div>  
      <div v-if="tooltipIndex === '新增圖片節點'" class="tooltip">{{ tooltipIndex }}</div>
      <div v-if="tooltipIndex === '新增影片節點'" class="tooltip">{{ tooltipIndex }}</div>   
      <div v-if="tooltipIndex === 'Display QR Code'" class="tooltip">產生展示QRcode</div>
      <div v-if="tooltipIndex === 'Edit QR Code'" class="tooltip">產生編輯QRcode</div>
      <div v-if="tooltipIndex === 'Upload Content'" class="tooltip">儲存場景</div> 
    </div>
  </span>
</template>
  
<script setup>
  import { useDBHandleStore } from '../stores/DBHandle';
  import AddNode from './AddNode.vue';
  import { ref } from 'vue';

  const DBHandleStore = useDBHandleStore();
  const { DBNodes, NodesRefresh, scenesID, sceneList, userToken, checkLogin, setNodesByGetPages, getSceneList, addNewScene } = DBHandleStore;

  const tooltipIndex = ref(null);

  const getIconSrc = (state) => {
    let basePath = '/menuBar/';
    return `${basePath}PlusButton001${state}.svg`;
  }; 

  const showTooltip = (index) => {
    tooltipIndex.value = index;
  };

  const hideTooltip = () => {
    tooltipIndex.value = null;
  };
  const menuButtons = [
    { name: 'QR-Display', tooltip: 'Display QR Code' },
    { name: 'QR-Edit', tooltip: 'Edit QR Code' },
    { name: 'UploadButton', tooltip: 'Upload Content' }
  ];

  const getQRIconSrc = (buttonName, state) => {
    let basePath = '/menuBar/';
    return `${basePath}${buttonName}${state}.svg`;
  };
</script>
  
<style>
  img{
    -webkit-user-select: none;-webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none;-webkit-user-select: none; /* Firefox 2+ */
    -ms-user-select: none;-webkit-user-select: none; /* IE 10+ */
    user-select: none;-webkit-user-select: none; /* Standard syntax */
    
  }

  .container {
    
    flex-direction: row;
    align-items: center;    
    justify-content: center; /* 使整個元件水平居中 */
    width: auto;
  }
  .menu-bar-wrapper {
    border-radius: 50px;
    background: var(--basic, #EFF2F9);
    box-shadow: 5px 5px 10px 0px rgba(22, 27, 29, 0.23), -5px -5px 10px 0px #FAFBFF;
    width: fit-content;
    height: 48px;
    flex-shrink: 0;
    margin-right: auto;
    align-items: center;
    display: flex;
    display: inline-flex; /* 讓容器適應內容 */
    padding: 0 16px; /* 左右各增加 32px 的內間距 */
    margin-right: 16px; /* 與 add-node-wrapper 之間的距離 */
  }
  .menu-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto 0;
  }

  .menu-button {
    width: 32px;
    height: 32px;
    margin-right: 0px;
    position: relative;
    margin: 0; 
  }

  .addScene {
    width: 24px;
    height: 24px;
    position: relative;
    margin: 0; 
  }
  .normal-icon
  .hover-icon,
  .press-icon {
    width: 24px;
    height: 24px;
    display: none;
    z-index: 100;
  }
  .addScene .normal-icon{
    width: 24px;
    height: 24px;
    display: block;
    z-index: 100;
  }

  .addScene:hover .hover-icon{
    width: 24px;
    height: 24px;
    display: block;
    z-index: 100;
  } 
  .addScene:hover .normal-icon,
  .addScene:hover .press-icon{
    width: 24px;
    height: 24px;
    display: none;
    z-index: 100;
  } 
  .addScene:active .press-icon {
    width: 24px;
    height: 24px;
    display: block;
  }
  .addScene:active .hover-icon,
  .addScene:active .normal-icon {
    width: 24px;
    height: 24px;
    display: none;
  }
  .add-node-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tooltip {
    position: absolute;
    bottom: 100%; /* 調整這個值可以改變 tooltip 的位置 */
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 5px;
    border-radius: 3px;
    z-index: 1000;
  }
 .selected {
    width: 48px;  /* 調整為你想要的大小 */
    height: 48px;  /* 調整為你想要的大小 */
  }
  .menu-item-wraper{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center; /* 使整個元件水平居中 */
    padding: 24px;
  }

  .menu-item {
    position: relative;
    align-items: center;
    margin: 0 2px; /* Adjust spacing as needed */

  }

  .QR-Display,
  .QR-Edit,
  .UploadButton {
    width: 48px;
    height: 48px;
    display: block;
  }

  .QR-Display-hover,
  .QR-Edit-hover,
  .UploadButton-hover,
  .QR-Display-click,
  .QR-Edit-click,
  .UploadButton-click {
    width: 48px;
    height: 48px;
    display: none;
  }

  .menu-item:hover .QR-Display-hover,
  .menu-item:hover .QR-Edit-hover,
  .menu-item:hover .UploadButton-hover {
    display: block;
  }

  .menu-item:active .QR-Display-click,
  .menu-item:active .QR-Edit-click,
  .menu-item:active .UploadButton-click {
    display: block;
  }
  .menu-item:active .QR-Display-hover,
  .menu-item:active .QR-Edit-hover,
  .menu-item:active .UploadButton-hover {
    display: none;
  }

  /* Hide normal icons on hover and click */
  .menu-item:hover .QR-Display,
  .menu-item:hover .QR-Edit,
  .menu-item:hover .UploadButton,
  .menu-item:active .QR-Display,
  .menu-item:active .QR-Edit,
  .menu-item:active .UploadButton {
    display: none;
  }
</style>
  