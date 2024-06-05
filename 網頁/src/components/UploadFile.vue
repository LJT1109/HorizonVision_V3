<template>
  <div class="UploadFile">
    <label v-if="(!preview && canUpload)">
      <span style="width: 100%; height: 100%; display: block;">點選以上傳{{ type=type=='image'? '圖片' : '影片'}}</span>
      <input type="file" @change="handleFileUpload" :accept="acceptedFormats" hidden />
    </label>

    <div v-if="preview" >
      <img v-if="props.type == 'image'" :src="preview" :style="imageStyle" alt="Image Preview" />
      <video style="border-radius: 10px;" ref="videoRef" v-else controls :style="videoStyle" @loadedmetadata="handleVideoMetadata">
        <source :src="preview" type="video/mp4">
      </video>
    </div>
  </div>
</template>



<script setup>
import { ref, reactive, watch,defineEmits, onMounted ,computed,nextTick} from 'vue';
import { useApi } from "../composables/UseApi";
import { useDBHandleStore } from '../stores/DBHandle';

const { data, error, uploadFile } = useApi();
const DBHandleStore = useDBHandleStore();
const { DBNodes, scenesID, setNodesByGetPages, getSceneList} = DBHandleStore;

const props = defineProps(['type','modelValue']);
const emits = defineEmits(['update:modelValue']);
const acceptedImageFormats = 'image/png,image/jpeg,image/jpg,image/gif';
const acceptedVideoFormats = 'video/mp4';

const preview = ref(null);
const isImage = ref(true);
const imageStyle = reactive({});
const videoStyle = reactive({});
const token = ref(""); // 替換為您的 token
const type = props.type; // 替換為您的 type
const canUpload = ref(true); // 控制是否可以上傳
const videoRef = ref(null);
const filename = ref(props.modelValue);

const acceptedFormats = computed(() => {
  return props.type == 'image' ? acceptedImageFormats : acceptedVideoFormats;
});
nextTick(()=>{
  acceptedFormats.value = props.type == 'video' ? acceptedImageFormats : acceptedVideoFormats;
})
const handleFileUpload = async (event) => {

  const uploadedFile = event.target.files[0];
  if (!uploadedFile) return;

  // 檢查檔案類型
  const fileType = uploadedFile.type;
  if (!acceptedFormats.value.split(',').includes(fileType)) {
    alert('不支援此檔案類型');
    return;
  }
  if ((type === "image" && !fileType.startsWith("image")) ||
      (type === "video" && !fileType.startsWith("video"))) {
    alert(`只接受 ${type} 類型的檔案`);
    return;
  }
  isImage.value = !fileType.includes("video");

  // 上傳檔案
  await uploadFile(uploadedFile, token.value, type);

  if (data.value) { // 假設成功的回應包含一個 'success' 屬性
    // 更新預覽 URL
    filename.value = data.value;
    // const url = `https://horizonvision.ljthub.com/bg2/uploads/${token.value}/${type}/${filename.value}`;
    const url = filename.value;
    preview.value = url;
    emits('update:modelValue', filename.value);
    if (type === "image") {
      loadImage(url);
    }
  } else {
    console.error('上傳失敗:', error.value);
  }


};
const loadImage = (url) => {
  const img = new Image();
  img.src = url;
  img.onload = () => {
    const cssWidth = 180;
    const cssHeight = 132;
    adjustSize(img.width, img.height, cssWidth, cssHeight, imageStyle);
  };
};
const handleVideoMetadata = () => {
  if (videoRef.value) {
    const video = videoRef.value;
    const originalWidth = video.videoWidth;
    const originalHeight = video.videoHeight;
    const cssWidth = 180;
    const cssHeight = 132;

    adjustSize(originalWidth, originalHeight, cssWidth, cssHeight, videoStyle);
  } else {
    console.warn('Video element not yet mounted');
  }
};


const adjustSize = (originalWidth, originalHeight, cssWidth, cssHeight, styleObj) => {
  const aspectRatio = originalWidth / originalHeight;
  let newWidth, newHeight;
  if (originalWidth / originalHeight > cssWidth / cssHeight) {
    newWidth = cssWidth;
    newHeight = cssWidth / aspectRatio;
  } else {
    newHeight = cssHeight;
    newWidth = cssHeight * aspectRatio;
  }
  if(styleObj==videoStyle){
    styleObj.width = `180px`;
    styleObj.height = `130px`;
  }
  else{
    styleObj.width = `${newWidth}px`;
    styleObj.height = `${newHeight}px`;
  }

};

watch(() => props.modelValue, (newVal) => {
  // 這裡處理 modelValue 變化的邏輯
  filename.value = newVal;
  // console.log(filename.value,"path");
  if(filename.value!=""){
    // const url = `https://horizonvision.ljthub.com/bg2/uploads/${token.value}/${type}/${props.modelValue}`;
    const url = props.modelValue;
    preview.value = url;
    if (type === "image") {
      loadImage(url);
    }
    else{
      handleVideoMetadata();
    }
  }
});

onMounted(() => {
  console.log(props.type,"type",acceptedFormats.value,"accept")
  if (DBHandleStore.scenesID != -1) {
    token.value = DBHandleStore.sceneList[DBHandleStore.scenesID]['editToken'];
  } else {
    canUpload.value = false;
    console.log("scene unselected");
  }
  if(props.type=="image"){
    acceptedFormats.value = acceptedImageFormats;
  }else{
    acceptedFormats.value = acceptedVideoFormats;
  }
  
});
</script>

<style>

.UploadFile {
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
.clear-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  cursor: pointer;
  z-index: 50;
}

</style>