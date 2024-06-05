<template>
  <div>
    <Bezier v-for="(connection, index) in lineConnection" :key="`${connection[0]}-${connection[1]}`"
      :coordsA="getNodeDataByIndex(parseInt(connection[0])).position"
      :coordsB="getNodeDataByIndex(parseInt(connection[1])).position" />
  </div>
</template>
  
<script setup>
import { ref, watchEffect, nextTick, onMounted, onUnmounted } from 'vue';
import Bezier from './Bezier.vue';
import { useNodeHandleStore } from '../stores/NodeHandle';
import { useDBHandleStore } from '../stores/DBHandle';

const nodeHandleStore = useNodeHandleStore();
const { getNodeDataByIndex, connections } = nodeHandleStore;
const lineConnection = ref(nodeHandleStore.connections);
const DBHandleStore = useDBHandleStore();
const { DBNodes, NodesRefresh, setNodesByGetPages } = DBHandleStore;

let intervalId;

onMounted(() => {
  intervalId = setInterval(() => {
    // 這裡是您希望每5秒執行一次的代碼
    nextTick(() => {
      lineConnection.value = [...nodeHandleStore.connections];
      // console.log("Updated connections:", nodeHandleStore.connections);
    });
  }, 5);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

watchEffect(() => {
  if (DBHandleStore.NodesRefresh) {

      lineConnection.value = [nodeHandleStore.connections];
      // console.log("Refreshed connections:", nodeHandleStore.connections);
      DBHandleStore.NodesRefresh = false;

  }
});
</script>


  