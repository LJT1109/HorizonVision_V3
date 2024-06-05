import { computed, readonly, ref } from "vue";
import { defineStore } from "pinia";
import { useApi } from "../composables/UseApi";


export const useNodeHandleStore = defineStore("NodeHandle", () => {
  const textNodes = ref([]);
  const prevNodeIndex = ref(null);
  const prevElement = ref({});
  const connections = ref([]);
  const QRcode = ref('');
  const { data, error, login, register, getScenes, getPages, updatePages, newScene } = useApi();

  const setPrevNodeIndex = (nodeIndex) => {
    prevNodeIndex.value = nodeIndex;
  };
  const setPrevElement = (element) => {
    prevElement.value = element;
  };
  const addConnection = (nodeConnector, nodeIn) => {
    const exists = connections.value.some(
      (conn) => conn[0] === nodeConnector && conn[1] === nodeIn
    );
  
    if (!exists && nodeConnector != nodeIn) {
      connections.value.push([nodeConnector, nodeIn]);
  
      const nodeConnectorData = getNodeDataByIndex(nodeConnector);
      const nodeInData = getNodeDataByIndex(nodeIn);
  
      nodeConnectorData.next.push(nodeIn);
      nodeInData.prev.push(nodeConnector);
  
      setTextNodeDataByIndex(nodeConnector, { next: nodeConnectorData.next });
      setTextNodeDataByIndex(nodeIn, { prev: nodeInData.prev });
  
      console.log("link", nodeConnector, nodeIn,nodeConnectorData);
      return true;
    }
    return false;
  };
  
  const subConnection = (nodeConnector, nodeIn) => {
    const index = connections.value.findIndex(
      (conn) => conn[0] === nodeConnector && conn[1] === nodeIn
    );
  
    if (index !== -1) {
      connections.value.splice(index, 1);
  
      const nodeConnectorData = getNodeDataByIndex(nodeConnector);
      const nodeInData = getNodeDataByIndex(nodeIn);
  
      nodeConnectorData.next = nodeConnectorData.next.filter(n => n !== nodeIn);
      nodeInData.prev = nodeInData.prev.filter(n => n !== nodeConnector);
  
      setTextNodeDataByIndex(nodeConnector, { next: nodeConnectorData.next });
      setTextNodeDataByIndex(nodeIn, { prev: nodeInData.prev });
  
      console.log("unlink", connections.value);
      return true;
    }
    return false;
  };
  
  const addTextNode = (nodeProps) => {
    textNodes.value.push(nodeProps);

  };
  const getNodeDataByIndex = (index) => {
    const node = textNodes.value.find(node => node.index == index);
    if (!node) {
      console.warn(`Node with index ${index} not found.`);
      return { position: { x: 0, y: 0 } };  // 返回一個預設對象
    }
    // console.warn(`Node index ${index} found.`);
    return node;
  };
  
  const setTextNodeDataByIndex = (index, newData) => {
    const node = textNodes.value.find((node) => node.index == index);
    if (node) {
      if (newData.hasOwnProperty('x') && newData.hasOwnProperty('y')) {
        node.position.x = newData.x;
        node.position.y = newData.y;
      }
      if (newData.hasOwnProperty('prev')) {
        node.prev = newData.prev;
      }
      if (newData.hasOwnProperty('next')) {
        node.next = newData.next;
      }
      if (newData.hasOwnProperty('groupId')) {
        node.groupId = newData.groupId;
      }
      if (newData.hasOwnProperty('head')) {
        node.head = newData.head;
        // console.log("head",(index, newData));
      }
      if (newData.content !== undefined) {
        node.content = newData.content;
      }
    } else {
      console.log("未找到節點",index,newData);
    }
  };

  const getNodeDataJSON = (sceneID) => {

    const data = textNodes.value.map((node) => {

      return {
        web_id: node.index.toString(),
        sid: sceneID,
        prev: Array.from(new Set(node.prev)).join("_"),
        next: Array.from(new Set(node.next)).join("_"),
        type: node.type,
        url: node.url,
        content: node.content,
        groupid: node.groupId.toString(),
        head: node.head.toString(),
        position: `${Math.floor(node.position.x)}_${Math.floor(node.position.y)}`,
        hash : node.hash,
      };
    });
    return JSON.stringify(data);
  };
  const clearNodes = () => {
    textNodes.value = [];
    connections.value = [];
  };
  
  
  return {
    prevNodeIndex,
    prevElement,
    textNodes,
    connections,
    QRcode,
    setPrevNodeIndex,
    setPrevElement,
    addConnection,
    subConnection,
    addTextNode,
    getNodeDataByIndex,
    setTextNodeDataByIndex,
    getNodeDataJSON,
    clearNodes,
  };
});
