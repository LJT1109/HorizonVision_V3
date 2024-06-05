<template>
    <div  class="groupBar" >
        <span v-component-name="'Dropdown'" style="font-weight: 900;font-size: 16px;">{{ content=isFocused? 'GROUP':groupId=groupId==0? content:groupId }} </span>
        <div v-if="isFocused && GroupHandleStore.showDropdown" class="dropdown" >
            <div v-for="n in MaxGroupId" :key="n" :data-item="n" v-component-name="'SelectItem'"
                @mouseenter="handleMouseEnter($event, n)" @mouseout="handleMouseOut($event, n)"
                style="font-weight: 900;font-size: 16px;">
                {{ n }}
            </div>
            <div >
                <AddDropdown />
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref ,computed ,defineProps,watch,onMounted,watchEffect} from 'vue';
import AddDropdown from './AddDropdown.vue';
import { useGroupHandleStore } from '../stores/GroupHandle';
import { useNodeHandleStore } from '../stores/NodeHandle';

const props = defineProps(['selected']);
// console.log(props.selected);
const GroupHandleStore = useGroupHandleStore();
const { groups, addGroup, maxGroupId,  setHead, getToggleDropdown,showDropdown,selectedItem} = GroupHandleStore;
const nodeHandleStore = useNodeHandleStore();
const { textNodes, connections, prevNodeIndex, prevElement, QRcode, setPrevNodeIndex, getNodeDataByIndex, setPrevElement, addConnection ,setTextNodeDataByIndex, subConnection, getNodeDataJSON} = nodeHandleStore;

const isFocused = ref(false);
const groupId = ref(0);
const groupHead = ref(true);
let content = 'NO GROUP';

const handleMouseEnter = (event, n) => {
    event.target.style.backgroundColor = '#AFC7FF'; // 更改為所需的顏色
};

const handleMouseOut = (event, n) => {
    event.target.style.backgroundColor = ''; // 復原顏色或設置為其他顏色
};

watch(()=>getNodeDataByIndex(props.selected).groupId, (newVal)=>{
    groupId.value = newVal == '-1' ? '' : newVal;

});

const MaxGroupId = computed(() => {
    if (nodeHandleStore.textNodes.length == 0) {
        return 1; // 如果沒有群組，返回 -1 或其他預設值
    }
    return Math.max(...nodeHandleStore.textNodes.map(node => node.groupId),GroupHandleStore.maxGroupId);
});

watch(()=>getToggleDropdown(), (newVal)=>{
    if(props.selected == getToggleDropdown().nodeId){
        isFocused.value = newVal.show;
    }
    else{
        isFocused.value = false;
    }
    // console.log("6546",groupId.value);
});

onMounted(() =>{
    groupId.value = getNodeDataByIndex(props.selected).groupId == '-1' ? '' :getNodeDataByIndex(props.selected).groupId;
    GroupHandleStore.maxGroupId = Math.max(...nodeHandleStore.textNodes.map(node => node.groupId),1);
});

</script>
  
<style>
.groupBar{
    position: absolute;
    border-radius: var(--br-3xs);
    background-color: var(--color-aliceblue-100);
    box-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3),
      -1px -1px 2px rgba(207, 213, 214, 0.5),
      -1px 1px 2px rgba(207, 213, 214, 0.2) inset,
      1px -1px 2px rgba(207, 213, 214, 0.2) inset,
      -1px -1px 2px rgba(255, 255, 255, 0.9) inset,
      1px 1px 3px rgba(207, 213, 214, 0.9) inset;
    width: 136px;
    height: 19px;
    font-weight: 900;
}
.dropdown {
    position: relative;
    border-radius: 10px;
    background-color: rgba(243, 247, 247, 0.6);
    box-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
    width: 100%;
    height: auto;
    font-size: 12px;
    text-align: center;
    
}

</style>
  