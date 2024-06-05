<template></template>
  
<script setup>
import { ref, watch, onMounted, onUnmounted, defineEmits } from 'vue';
import { useNodeHandleStore } from '../stores/NodeHandle';
import { useGroupHandleStore } from '../stores/GroupHandle';
import { useDBHandleStore } from '../stores/DBHandle';
import { useApi } from "../composables/UseApi";


const nodeHandleStore = useNodeHandleStore();
const { connections, prevNodeIndex, prevElement, QRcode, setPrevNodeIndex, setPrevElement, addConnection ,subConnection, getNodeDataJSON, setTextNodeDataByIndex} = nodeHandleStore;
const GroupHandleStore = useGroupHandleStore();
const { groups, showDropdown, selectedItem, addGroup,groupMaxId,   setHead, getToggleDropdown, setToggleDropdown, setSelectItem, checkGroupHasHead } = GroupHandleStore;
const DBHandleStore = useDBHandleStore();
const { DBNodes, scenesID, userToken, setNodesByGetPages, getSceneList} = DBHandleStore;

const { data, error, login, register, getScenes, getPages, updatePages, newScene } = useApi();

const emits = defineEmits(['add-text-node','add-image-node','add-video-node', 'add-scene','get-scene']);

const addTextNode = () => {
  emits('add-text-node');
};
const addImageNode = () => {
  emits('add-image-node');
};
const addVideoNode = () => {
  emits('add-video-node');
};
const addScene = () => {
  emits('add-scene');
};
const getScene = () => {
  emits('get-scene');
};
const handleElementClick = (event) => {

  let element = event.target;
  let nodeIndex = -1;
  let item = -1;
  let componentName = "clickedOther"; // 預設值

  while (element) {
    let tempElement = element;

    // 尋找 nodeIndex
    while (nodeIndex == -1 && tempElement) {
      if (tempElement.dataset.nodeIndex) {
        nodeIndex = tempElement.dataset.nodeIndex;
        //console.log("index",nodeIndex);
        break;
      }
      tempElement = tempElement.parentElement;
    }

    tempElement = element; // 重置 tempElement

    // 尋找 item
    while (item == -1 && tempElement) {
      if (tempElement.dataset.item) {
        item = tempElement.dataset.item;
        //console.log("item",item);
        break;
      }
      tempElement = tempElement.parentElement;
    }

    // 設置 componentName
    if (element.dataset.componentName) {
      componentName = element.dataset.componentName;
      //console.log(componentName);
    }

    // 移動到父元素
    element = element.parentElement;

    // 如果找到了所有需要的數據，則退出迴圈
    if (nodeIndex != -1 && componentName) {
      break;
    }
  }
  console.log("componentName",componentName);
  if (componentName === "NodeConnector") {
    if (nodeHandleStore.prevElement == "NodeIn") {
      if (nodeIndex != nodeHandleStore.prevNodeIndex) {
        
        if(subConnection(nodeIndex,nodeHandleStore.prevNodeIndex )){
          setPrevElement("clickedOther");
        }
        else{
          setPrevElement(componentName);
        }
      }
      else {
        setPrevElement("NodeIn");
      }
    }
    else {
      setPrevElement(componentName);
    }
    setToggleDropdown(false, nodeIndex);
  }
  else if (componentName === "NodeIn") {
    if (nodeHandleStore.prevElement == "NodeConnector") {
      if (nodeIndex != nodeHandleStore.prevNodeIndex) {
              
        if(addConnection(nodeHandleStore.prevNodeIndex, nodeIndex)){
          setPrevElement("clickedOther");
        }
        else{
          setPrevElement(componentName);  
        }
      }
      else {
        setPrevElement("NodeConnector");
      }
    }
    else {
      setPrevElement(componentName);
    }
    setToggleDropdown(false, nodeIndex);
  }
  else if (componentName === "AddTextNode") {
    addTextNode();
    setToggleDropdown(false, nodeIndex);
  }
  else if (componentName === "AddImageNode") {
    addImageNode();
    setToggleDropdown(false, nodeIndex);
  }
  else if (componentName === "AddVideoNode") {
    addVideoNode();
    setToggleDropdown(false, nodeIndex);
  }
  else if (componentName === "AddDropdown") {
    addGroup();
  }
  else if (componentName === "Dropdown") {
    if (getToggleDropdown().nodeId == nodeIndex) {
      setToggleDropdown(!getToggleDropdown().show, nodeIndex);

    }
    else {
      setToggleDropdown(true, nodeIndex);

    }
  }
  else if (componentName === "SelectItem") {
    // console.log("item:", item, nodeIndex);
    if (getToggleDropdown().nodeId == nodeIndex) {
      setSelectItem(`群組 : ${item}`);
      setToggleDropdown(!getToggleDropdown().show, nodeIndex);

    }
    
    setTextNodeDataByIndex(nodeIndex, {groupId : item, head : false});
  }
  else if (componentName === "SetHead") {
    console.log("頭",nodeIndex);
    setHead(nodeIndex);
  }
  else if (componentName === "QR-Display") {
    if(nodeHandleStore.prevElement == "QR-Edit"){
      nodeHandleStore.QRcode = 'display';
    }else{
      nodeHandleStore.QRcode = nodeHandleStore.QRcode == 'display' ? '' : 'display';
    }    
    console.log("QR-Display",nodeHandleStore.QRcode); 
  }
  else if (componentName === "QR-Edit") {
    if(nodeHandleStore.prevElement == "QR-Display"){
      nodeHandleStore.QRcode = 'edit';
    }else{
      nodeHandleStore.QRcode = nodeHandleStore.QRcode == 'edit' ? '' : 'edit';
    }
    console.log("QR-Edit",nodeHandleStore.QRcode);
  }
  else if(componentName === "UploadButton"){
    nodeHandleStore.QRcode = '';
    if(DBHandleStore.scenesID!=-1){

      const sceneId = DBHandleStore.sceneList[DBHandleStore.scenesID]['id'];
      if(checkGroupHasHead()){
        console.log(sceneId);
        console.log(getNodeDataJSON(sceneId));
        updatePages(getNodeDataJSON(sceneId), sceneId);
        getScenes(DBHandleStore.userToken).then(result => {
          console.log(" scene:", data.value);
        });
      }

    }
    else{
      alert("選場景!!");
    }


  }
  else if (componentName.startsWith("getScene")) {
    console.log("ID",DBHandleStore.scenesID);
    nodeHandleStore.QRcode = '';
    let sceneId = 0;
    if(DBHandleStore.scenesID!=-1){      
      sceneId = DBHandleStore.sceneList[DBHandleStore.scenesID]['id'];
      if(checkGroupHasHead()){
        console.log(getNodeDataJSON(sceneId));
        updatePages(getNodeDataJSON(sceneId), sceneId);
        getScenes(DBHandleStore.userToken).then(result => {
          console.log(" scene:", data.value);
        });
      }
    }  
    sceneId = componentName.substring(8);
    DBHandleStore.scenesID = sceneId;
    sessionStorage.setItem('sceneid', DBHandleStore.scenesID);
    getScenes(DBHandleStore.userToken).then(result => {
      // console.log(" scene:", DBHandleStore.userToken);
      setNodesByGetPages(data.value['scenes'][sceneId]['editToken']).then(() => {
        // console.log(" page:", DBHandleStore.DBNodes);
        getScene();
      });
    });    
  }
  else if (componentName === "addScene") {
    addScene();  
  }
  else {
    nodeHandleStore.QRcode = '';
    setToggleDropdown(false, nodeIndex);
    setPrevElement(componentName);

  }
  setPrevNodeIndex(nodeIndex);
};

onMounted(() => {
  window.addEventListener('click', handleElementClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleElementClick);
});


</script>
  