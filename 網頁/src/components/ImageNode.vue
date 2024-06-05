<template>
    <div v-component-name="'ImageNode'" :class="$style.TextNode" ref="draggable" @mousedown="dragStart">
        <div :class="$style.TextNodeBody">
            <NodeConnector :data-node-index="props.nodeProps.index" :class="$style.NodeConnector" />
            <NodeIn :data-node-index="props.nodeProps.index" :class="$style.NodeIn" />
            <!-- <p :class="$style.Title">Image{{ props.nodeProps.index }}</p> -->
            <UploadFile @click="openEditor" v-model="filename" :type="'image'"/>
            <div :class="$style.DropdownContainer" v-component-name="'SetHead'">
                <Dropdown :class="$style.Dropdown" :data-node-index="props.nodeProps.index" :selected="props.nodeProps.index" />
                <div :class="$style.ButtonHead" >
                    <span :class="$style.HeadOn" v-component-name="'SetHead'" v-if="isHead">
                        <img
                            :class="$style.HeadIcon"
                            alt=""
                            src="/head.svg"
                        />
                    </span>
                    <span :class="$style.HeadOff" v-component-name="'SetHead'" v-else>
                        <img
                            :class="$style.HeadIcon"
                            alt=""
                            src="/head.svg"                            
                        />
                    </span>
                </div>
            </div>


        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, watch, defineProps } from 'vue';
import NodeConnector from './NodeConnector.vue';
import UploadFile from './UploadFile.vue';
import NodeIn from './NodeIn.vue';
import { useNodeHandleStore } from '../stores/NodeHandle';
import { useGroupHandleStore } from '../stores/GroupHandle';
import Dropdown from './Dropdown.vue';
import { useRouter } from 'vue-router';


const nodeHandleStore = useNodeHandleStore();
const { getNodeDataByIndex, setTextNodeDataByIndex, connections, textNodes } = nodeHandleStore;
const GroupHandleStore = useGroupHandleStore();
const { groups, addGroup,  setHead, showDropdown, selectedItem } = GroupHandleStore;
const filename = ref("");
const isHead = ref(false);
const draggable = ref(null);
const hash = ref("");
let offsetX, offsetY;
const props = defineProps(['nodeProps', 'offset']);
const router = useRouter(); // 獲取 router 實例

const openEditor = () => {
    console.log("openEditor");
    // console.log(hash.value);

    
    // 使用 router.push 進行頁面重定向
    router.push({ name: 'MediaNode', params: { node_id: hash.value } });
}

const dragStart = (e) => {
    offsetX = e.clientX - draggable.value.getBoundingClientRect().left + props.offset[0];
    offsetY = e.clientY - draggable.value.getBoundingClientRect().top + props.offset[1];
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

};

const drag = (e) => {
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    draggable.value.style.left = `${x}px`;
    draggable.value.style.top = `${y}px`;
    const position = { x, y };
    setTextNodeDataByIndex(props.nodeProps.index, position);
};

const dragEnd = () => {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
};

const updateContent = () => {
  // 這裡，fileName 是上傳成功後的文件名
//   console.log("update",filename.value);
  setTextNodeDataByIndex(props.nodeProps.index, { content: filename.value });
};
watch(filename, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    updateContent();
  }
});
watch(()=>getNodeDataByIndex(props.nodeProps.index).head,(newVal)=>{
    isHead.value = newVal;
});

onMounted(() => {
    //  console.log("位置",props.nodeProps.position);
    draggable.value.style.top = `${props.nodeProps.position.y}px` ;
    draggable.value.style.left = `${props.nodeProps.position.x}px` ;
    const position = { x: props.nodeProps.position.x , y: props.nodeProps.position.y  };
    setTextNodeDataByIndex(props.nodeProps.index, position);
    draggable.value.style.position = 'absolute';
    filename.value = getNodeDataByIndex(props.nodeProps.index).content;
    hash.value = getNodeDataByIndex(props.nodeProps.index).hash;
    console.log(filename.value,"file");
    isHead.value = getNodeDataByIndex(props.nodeProps.index).head;
});


</script>
  

<style module>
.TextNode {
    height: 220px;
    width: 256px;
    text-align: center;
    position: absolute;
    /* 設置相對定位，以便調整文本位置 */

    --offsetx: 0;
    --offsety: 0;
    z-index: 1;
}

.TextNodeBody {
    position: absolute;
    top: 0px;
    left: 28px;
    text-align: center;
    border-radius: var(--br-11xl);
    background-color: var(--color-aliceblue-200);
    box-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3) inset,
        -1px -1px 2px rgba(191, 194, 199, 0.5) inset,
        -5px 5px 10px rgba(191, 194, 199, 0.2),
        5px -5px 10px rgba(191, 194, 199, 0.2),
        -5px -5px 10px rgba(255, 255, 255, 0.9),
        5px 5px 13px rgba(191, 194, 199, 0.9);
    width: 200px;
    height: 220px;

}

.InputField {
    border: none;
    background-color: var(--color-aliceblue-100);
    position: absolute;
    top: 27px;
    left: 10px;
    border-radius: var(--br-3xs);
    box-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3),
        -1px -1px 2px rgba(203, 206, 212, 0.5),
        -1px 1px 2px rgba(203, 206, 212, 0.2) inset,
        1px -1px 2px rgba(203, 206, 212, 0.2) inset,
        -1px -1px 2px rgba(255, 255, 255, 0.9) inset,
        1px 1px 3px rgba(203, 206, 212, 0.9) inset;
    width: 180px;
    height: 132px;
    font-size: 18px;

}

.TextNodeBody>.DropdownContainer {
    top: 80%;

}

.DropdownContainer {
    position: absolute;
    font-size: 12px;
    width: 200px;
    height: 40px;
    user-select: none;-webkit-user-select: none;
}

.DropdownContainer>.ButtonHead {
    position: absolute;
    top: 0%;
    left: 80%;
}
.DropdownContainer>.Dropdown{
    position: absolute;
    top: 30%;
    left: 6%;
}
.ButtonHead {

    width: 72px;
    height: 72px;
}


.TextNodeBody>.NodeConnector {
    position: absolute;
    top: 50%;
    /* 加上垂直位移量 */
    right: -12.5%;
    /* 加上水平位移量 */
}

.TextNodeBody>.NodeIn {
    position: absolute;
    top: 50%;
    /* 加上垂直位移量 */
    left: -12.5%;
    /* 加上水平位移量 */
}

.Title {
    position: absolute;
    top: 0px;

    font-size: 24px;
}
.HeadIcon {
    position: absolute;
    border-radius: var(--br-3xs);
    width: 96px;
    height: 96px;
    pointer-events: none;
    user-select: none;-webkit-user-select: none;
    transition: top 0.3s ease, left 0.3s ease;
}
.HeadOn>.HeadIcon{
    top: -36px;
    left: -20px;
}
.HeadOff>.HeadIcon{
    top: -36px;
    left: -36px;
}
.HeadOn{
    position: absolute;
    top: 15px;
    left: 0px;
    border-radius: var(--br-3xs);
    background-color: var(--green);
    box-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3),
      -1px -1px 2px rgba(191, 194, 196, 0.5),
      -1px 1px 2px rgba(191, 194, 196, 0.2) inset,
      1px -1px 2px rgba(191, 194, 196, 0.2) inset,
      -1px -1px 2px rgba(255, 255, 255, 0.9) inset,
      1px 1px 3px rgba(191, 194, 196, 0.9) inset;
    width: 32px;
    height: 16px;

}
.HeadOff{
    position: absolute;
    top: 15px;
    left: 0px;
    border-radius: var(--br-3xs);
    background-color: var(--pink);
    box-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3),
      -1px -1px 2px rgba(191, 194, 196, 0.5),
      -1px 1px 2px rgba(191, 194, 196, 0.2) inset,
      1px -1px 2px rgba(191, 194, 196, 0.2) inset,
      -1px -1px 2px rgba(255, 255, 255, 0.9) inset,
      1px 1px 3px rgba(191, 194, 196, 0.9) inset;
    width: 32px;
    height: 16px;
    z-index: 2;
}
</style>
  