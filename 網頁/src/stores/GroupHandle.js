import { ref } from "vue";
import { defineStore } from "pinia";
import { useNodeHandleStore } from './NodeHandle';

export const useGroupHandleStore = defineStore("GroupHandle", () => {
  const nodeHandleStore = useNodeHandleStore();
  const {textNodes, getNodeDataByIndex, setTextNodeDataByIndex} = nodeHandleStore;
  const groups = ref([{ groupId: 0, nodeIndex: -1, setHead: false }]);
  const showDropdown = ref(false);
  const selectedItem = ref("");
  const nodeId = ref(0);
  const maxGroupId = ref(0);
  const addGroup = () => {
    maxGroupId.value++;
  };

  const setHead = (nodeIndex) => {
    // 找到與 nodeIndex 匹配的群組
    const gid = getNodeDataByIndex(nodeIndex).groupId;
    nodeHandleStore.textNodes.forEach((node) =>{
      if(getNodeDataByIndex(node.index).groupId == gid && gid != '-1'){
        setTextNodeDataByIndex(node.index,{head: false});
        console.log("setNotHead",node.index);
      }      
    });
    console.log("sethead",nodeIndex);
    setTextNodeDataByIndex(nodeIndex,{head: true});
  };

  const setToggleDropdown = (boolean, index) => {
    showDropdown.value = boolean;
    nodeId.value = index;
  };
  const getToggleDropdown = () => {
    return { show: showDropdown.value, nodeId: nodeId.value };
  };
  const setSelectItem = (item) => {
    selectedItem.value = item;
    //showDropdown.value = false;
  };
  // const getGroup = (nodeIndex) => {
  //   // 使用 find 方法找到第一個匹配的群組

  //   const targetGroup = groups.value.find(
  //     (group) => group.nodeIndex == nodeIndex
  //   );

  //   // 如果找到了匹配的群組，返回其 groupId、setHead 和 targetIndex
  //   if (targetGroup) {
  //     return {
  //       groupId: targetGroup.groupId,
  //       setHead: targetGroup.setHead,
  //     };
  //   } else {
  //     return {
  //       groupId: "nogroup",
  //       setHead: false,
  //     };
  //   }
  //   // 如果沒有找到匹配的群組，返回 null 或其他適當的值
  // };
  const clearGroups = () => {
    groups.value = [{ groupId: 0, nodeIndex: -1, setHead: false }];
  };
  // const checkGroupHasHead = () => {
  //   let hasWarning = true;
    
  //   // 首先，將所有群組按 groupId 分組
  //   const groupMap = new Map();
  //   groups.value.forEach((group) => {
  //     if (!groupMap.has(group.groupId)) {
  //       groupMap.set(group.groupId, []);
  //     }
  //     groupMap.get(group.groupId).push(group);
  //   });
  
  //   // 遍歷 groupMap
  //   groupMap.forEach((groupList, groupId) => {
  //     // 使用 some 函數檢查是否有節點的 setHead 為 true
  //     const hasHead = groupList.some((group) => group.setHead == true);
  
  //     // 檢查 groupId 是否為字符串，並且數字大於 '0'
  //     const isStringAndGreaterThanZero = typeof groupId === 'string' && Number(groupId) > 0;
  
  //     // 如果沒有頭，並且 groupId 符合條件，發出警告
  //     if (!hasHead && isStringAndGreaterThanZero) {
  //       alert(`Group ${groupId} does not have a head.`);
  //       hasWarning = false;
  //     }
  //   });
  //   return hasWarning;
  // };
  const checkGroupHasHead = () => {
    let hasWarning = true;
    
    // 創建一個對象來存儲每個 groupId 的 head 狀態
    const groupHeadStatus = {};
  
    // 遍歷所有 textNodes
    nodeHandleStore.textNodes.forEach((node) => {
      const groupId = node.groupId;
      const head = node.head;
  
      // 如果 groupId 不是 -1
      if (groupId != '-1') {
        // 如果該 groupId 還沒有被檢查過，則初始化為 false
        if (!groupHeadStatus.hasOwnProperty(groupId)) {
          groupHeadStatus[groupId] = false;
        }
  
        // 如果該節點的 head 為 true，則將該 groupId 的狀態設為 true
        if (head) {
          groupHeadStatus[groupId] = true;
        }
      }
    });
  
    // 檢查哪些 groupId 沒有 head，並發出警告
    for (const [groupId, hasHead] of Object.entries(groupHeadStatus)) {
      if (!hasHead) {
        alert(`Group ${groupId} does not have a head.`);
        hasWarning = false;
      }
    }
  
    return hasWarning;
  };
  
  return {
    groups,
    maxGroupId,
    showDropdown,
    selectedItem,
    addGroup,
    setHead,
    setToggleDropdown,
    setSelectItem,
    getToggleDropdown,
    clearGroups,
    checkGroupHasHead,
  };
});
