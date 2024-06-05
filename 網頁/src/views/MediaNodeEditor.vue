
<template>
  <div class="preview-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <button @click="back">Back</button>
      <!-- 工具栏按钮和选项 -->
      <button @click="toggleBoundary(mediaNode)">调整大小</button>
      <input type="number" v-model="mediaNode.width" />
      <input type="number" v-model="mediaNode.height" />
      <input type="range" v-model="mediaNode.scale" min="10" max="200" />
      {{ mediaNode.scale }}%
      <br>
      <button @click="addTextSpace">添加文本空间</button>
      <button @click="addMediaSpace">添加媒體空间</button>
      <!-- 字體大小選擇 -->
      <select v-model="focusSpace.fontSize" v-if="focusSpace">
        <option v-for="size in fontSizeOptions" :key="size" :value="size">{{ size }}</option>
      </select>

      <!-- 字型選擇 -->
      <select v-model="focusSpace.fontFamily" v-if="focusSpace">
        <option v-for="font in fontFamilyOptions" :key="font" :value="font">{{ font }}</option>
      </select>

      <!-- 文字排列選擇 -->
      <select v-model="focusSpace.textAlign" v-if="focusSpace">
        <option v-for="align in textAlignOptions" :key="align" :value="align">{{ align }}</option>
      </select>

      <div class="resulting">
        <span v-if="this.saved" class="material-icons">save</span>
        <span v-else="mediaNode.saved" class="material-icons">sync</span>
        <button @click="generateJsonAndThumbnail">生成 JSON 和縮圖</button>
        <button @click="loadByJson">載入 JSON</button>
        <textarea v-model="jsonResult" ></textarea>
        <img v-if="thumbnailUrl" :src="thumbnailUrl" alt="MediaNode Thumbnail"/>
      </div>
      
      
    </div>

    <!-- 模拟的 MediaNode -->
    <div class="media-node-wrapper">
        <div class="media-node" :style="{
          width: mediaNode.width + 'px', 
          height: mediaNode.height + 'px',
          transform: 'scale(' + mediaNode.scale / 100 + ')'
        }">
          <div class="handle top" v-show="mediaNode.isBoundaryVisible" @mousedown.prevent="startResize($event,mediaNode, 'top')"></div>
          <div class="handle right" v-show="mediaNode.isBoundaryVisible" @mousedown.prevent="startResize($event,mediaNode, 'right')"></div>
          <div class="handle bottom" v-show="mediaNode.isBoundaryVisible" @mousedown.prevent="startResize($event,mediaNode, 'bottom')"></div>
          <div class="handle left" v-show="mediaNode.isBoundaryVisible" @mousedown.prevent="startResize($event,mediaNode, 'left')"></div>
          <div class="corner top-left" v-show="mediaNode.isBoundaryVisible" @mousedown.prevent="startResize($event,mediaNode, 'top-left')"></div>
          <div class="corner top-right" v-show="mediaNode.isBoundaryVisible" @mousedown.prevent="startResize($event,mediaNode, 'top-right')"></div>
          <div class="corner bottom-left" v-show="mediaNode.isBoundaryVisible" @mousedown.prevent="startResize($event,mediaNode, 'bottom-left')"></div>
          <div class="corner bottom-right" v-show="mediaNode.isBoundaryVisible" @mousedown.prevent="startResize($event,mediaNode, 'bottom-right')"></div>

          <!-- 文本空间 -->
          <div
            v-for="(space, index) in mediaNode.textSpaces"
            :key="index"
            class="text-space-wrapper"
            :style="textSpaceWrapperStyle(space)"
            @mousedown="space.isBoundaryVisible ? startDrag($event, space) : FocusingSpace(space)"
          >
            <div class="text-space" >
              <textarea v-model="space.content" :style="{ fontSize: space.fontSize, fontFamily: space.fontFamily, textAlign: space.textAlign }"></textarea>
              <div class="corner bottom-right" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'bottom-right')"></div>
            </div>
          </div>

          <!-- 多媒體空间 -->
          <div
            v-for="(space, index) in mediaNode.mediaSpaces"
            :key="index"
            class="media-space-wrapper"
            :style="mediaSpaceWrapperStyle(space)"
            @mousedown="space.isBoundaryVisible ? startDrag($event, space) : FocusingSpace(space)"
          >
          <div class="media-space" @dragover.prevent="handleDragOver" @drop.prevent="handleDrop($event, space)" @dragleave.prevent="handleDragLeave" >
              <input class="media-upload" type="file" :id="'fileInput-' + space.id" @change="handleFileChange($event, space)" accept=".mp4, .png, .jpg, .jpeg" style="display: none;"/>
              <button @click="triggerFileInput(space)">
                <span v-if="space.file===null" class="material-icons" @dragover.prevent>upload</span>
              </button>
              <div v-if="space.file===null"></div>
              <div v-else-if="space.type.includes('image')"><img :src="space.url" :style="{ width: '100%', height: '100%' }" /></div>
              <div v-else-if="space.type.includes('video')"><video :src="space.url" controls :style="{ width: '100%', height: '100%' }"></video></div>
              <div class="corner bottom-right" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'bottom-right')"></div>
            </div>
          </div>
          
                  
        </div>

    </div>
  </div>
</template>


<script>
import { mdiAccount } from '@mdi/js';
import { watch } from 'vue';

export default {
  data() {
    return {
      nodeid: null,
      saved: true,
      accountIcon: mdiAccount,
      focusSpace: null,
      currentResizeHandler: null,
      currentStopResizeHandler: null,
      doDragHandler: null,
      stopDragHandler: null,
      mediaNode: {
        isBoundaryVisible: false,
        isResizing: false,
        width: 600,
        height: 600,
        scale: 100,
        textSpaces: [],
        mediaSpaces: [],

      },
      fontSizeOptions: ['2px', '4px', '8px', '12px', '16px', '20px', '24px', '28px', '32px', '64px'], // 字體大小選項
      fontFamilyOptions: ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'], // 字體選項
      textAlignOptions: ['left', 'center', 'right', 'justify'],
      jsonResult: "",
      thumbnailUrl: null,
      changingTimer: null,
    };
  },
  methods: {
    UnsavedChanges() {
      this.saved = false;
    },
    
    back() {
      if (!this.saved) {
        if(!confirm('您的更改尚未保存。確定要離開嗎？'))
          return;
      }
      let sceneid = sessionStorage.getItem('sceneid');
      if(sceneid){
        this.$router.push({ name: 'Editor', params: { scene_id: sceneid } });
      }
        
    },

    loadByJson() {
      try {
        const data = JSON.parse(this.jsonResult);
        this.mediaNode = data;
      } catch (error) {
        console.error('Invalid JSON:', error);
      }
    },
    async generateThumbnail() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = this.mediaNode.width;
      canvas.height = this.mediaNode.height;
      ctx.fillStyle = '#eee';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 存储所有加载操作的 promise
      const loadPromises = [];

      // 处理文本空间
      this.mediaNode.textSpaces.forEach(space => {
        // 设置字体样式
        ctx.font = `${space.fontSize} ${space.fontFamily}`;
        ctx.fillStyle = 'black'; // 文本颜色
        ctx.textAlign = space.textAlign || 'left'; // 设置对齐方式，如果未指定则默认为左对齐
        // 绘制文本
        ctx.fillText(space.content, space.x, space.y + parseInt(space.fontSize), space.width);
      });

      // 处理多媒体空间
      this.mediaNode.mediaSpaces.forEach(space => {
        if (space.type.includes('image')) {
          const imgLoadPromise = new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, space.x, space.y, space.width, space.height);
              resolve(); // 图像加载并绘制完成
            };
            img.src = space.url;
          });
          loadPromises.push(imgLoadPromise);
        } else if (space.type.includes('video')) {
          const videoLoadPromise = new Promise(resolve => {
            const video = document.createElement('video');
            video.src = space.url;
            video.addEventListener('loadeddata', () => {
              video.currentTime = Math.min(Math.f｀loor(video.duration / 2), 1); // 尝试捕获视频中间的一帧
            });
            video.addEventListener('seeked', () => {
              ctx.drawImage(video, space.x, space.y, space.width, space.height);
              resolve(); // 视频帧加载并绘制完成
            });
          });
          loadPromises.push(videoLoadPromise);
        }
      });

      // 等待所有内容加载完成
      await Promise.all(loadPromises);
      
      this.thumbnailUrl = await canvas.toDataURL('image/png');
    },
    async uploadJsonAndThumbnail() {
      const formData = new FormData();
      console.log('nodeid:', this.nodeid)
      formData.append('nodeid', this.nodeid);
      formData.append('json', this.jsonResult);
      formData.append('thumbnail', this.thumbnailUrl);

      try {
        const response = await fetch('https://horizonvision.ljthub.com/bg2/upload.php', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          console.log('上传成功', response.statusText, await response.text());
          this.saved = true;
        } else {
          console.error('上传失败:', response.statusText);
          setInterval(() => {
            this.uploadJsonAndThumbnail();
          }, 3000);

        }
      } catch (error) {
        console.error('上传失败:', error);
      }
    },

    async generateJsonAndThumbnail() {
      this.jsonResult = JSON.stringify(this.mediaNode, null, 2);
      await this.generateThumbnail(); // 等待縮略圖生成完成
      this.uploadJsonAndThumbnail();
    },
    handleDragOver(event) {
      event.preventDefault(); // 防止默認行為，如打開檔案
      event.target.style.backgroundColor = 'lightblue'; // 改變背景顏色
    },
    handleDragLeave(event) {
      event.target.style.backgroundColor = ''; // 恢復背景顏色
    },  
    handleDrop(event, space) {
      event.preventDefault(); // 防止默認行為，如打開檔案
      event.target.style.backgroundColor = ''; // 恢復背景顏色

      if(event.dataTransfer.items) {
        // 使用 DataTransferItemList 接口來訪問檔案
        for(let i = 0; i < event.dataTransfer.items.length; i++) {
          // 如果拖拽的是檔案
          if(event.dataTransfer.items[i].kind === 'file') {
            let file = event.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            this.loadFile(file, space); // 載入檔案並更新 space 對象
          }
        }
      } else {
        // 使用 DataTransfer 接口來訪問檔案
        for(let i = 0; i < event.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
          this.loadFile(event.dataTransfer.files[i], space); // 載入檔案並更新 space 對象
        }
      }

      // 清除拖拽效果
      event.dataTransfer.clearData();
    },

    loadFile(file, space,url=null) {
      console.log('Loading file:', file);
      if(url){
        space.url = url;
      }else{
        space.file = file;
        space.type = file.type;
        space.url = URL.createObjectURL(file);
      }
      

      if (space.type.startsWith('image/')) {
        // 如果是图片文件，创建一个Image对象来读取尺寸
        let img = new Image();
        img.onload = () => {
          // 使用图片的宽度作为mediaNode的宽度，根据图片的宽高比调整高度
          space.file_height = img.height;
          space.file_width = img.width;
          this.adjustMediaNodeSize(space);
        };
        img.src = space.url;
      } else if (space.type.startsWith('video/')) {
        // 如果是视频文件，创建一个video元素来读取尺寸
        let video = document.createElement('video');
        video.onload = () => {
          // 使用视频的宽度作为mediaNode的宽度，根据视频的宽高比调整高度
          space.file_height = video.videoHeight;
          space.file_width = video.videoWidth;
          this.adjustMediaNodeSize(space);
        };
        video.src = space.url;
      }
    },

    adjustMediaNodeSize(space) {
      const width = space.file_width;
      const height = space.file_height;
      space.ratio = width / height;
      // console.log("ratio:", space.ratio);
      // 根据文件的尺寸调整mediaNode的大小
      // space.width = width; // 设置mediaNode的宽度为文件的宽度
      // 调整mediaNode的高度，保持文件的宽高比
      space.height = (height / width) * space.width;
    },

    handleFileChange(event, space) {
      if (event.target.files.length > 0) {
        space.file = event.target.files[0];
        space.type = space.file.type;
        space.url = URL.createObjectURL(space.file);
        // 這裡你可以添加更多的邏輯，例如預覽檔案、更新狀態等
        this.loadFile(space.file, space);

        //save file to server
        this.uploadFile(space.file, this.nodeid + space.id);
      }
    },
    triggerFileInput(space) {
      document.getElementById('fileInput-' + space.id).click();
    },
    toggleBoundary(node) {
      node.isBoundaryVisible = !node.isBoundaryVisible;
    },
    updateFocusSpace(space) {
      this.focusSpace = space;
      // 其他邏輯...
    },
    startResize(event, space, direction) {
        // 阻止事件冒泡和默认行为
        event.stopPropagation();
        event.preventDefault();

        space.isResizing = true;
        space.startDragX = event.clientX;
        space.startDragY = event.clientY;

        // 定义一个处理函数，这样可以确保后面可以使用相同的引用来移除监听器
        this.currentResizeHandler = (e) => this.doResize(e, space, direction);
        this.currentStopResizeHandler = () => this.stopResize(space);

        document.addEventListener('mousemove', this.currentResizeHandler);
        document.addEventListener('mouseup', this.currentStopResizeHandler);
    },
    doResize(event, space, direction) {
      if (!space.isResizing) return;

      const dx = event.clientX - space.startDragX;
      const dy = event.clientY - space.startDragY;
      const minWidth = 50;
      const minHeight = 50;

      if (direction.includes('right')) {
        let maxWidth = this.mediaNode.width - space.x; // 右側的最大可用寬度
        maxWidth = Math.min(Math.max(space.width + dx, 10), maxWidth);
        if(maxWidth < minWidth){
          space.width = minWidth;
        }else{
          space.width = maxWidth;
        }

      } else if (direction.includes('left')) {
        const newWidth = Math.max(space.width - dx, 10);
        const deltaX = space.width - newWidth; // 實際寬度變化量
        if(newWidth < minWidth){
          space.width = minWidth;
        }else{
          space.width = newWidth;
        }
        space.x = Math.max(space.x + deltaX, 0); // 更新 x 並確保不小於 0
      }

      if (direction.includes('bottom')) {
        const maxHeight = this.mediaNode.height - space.y; // 底部的最大可用高度
        space.height = Math.min(Math.max(space.height + dy, 10), maxHeight);
        if(space.height < minHeight){
          space.height = minHeight;
        }
      } else if (direction.includes('top')) {
        const newHeight = Math.max(space.height - dy, 10);
        const deltaY = space.height - newHeight; // 實際高度變化量
        space.height = newHeight;
        if(space.height < minHeight){
          space.height = minHeight;
        }
        space.y = Math.max(space.y + deltaY, 0); // 更新 y 並確保不小於 0
      }

      // console.log("space:", space);
      // console.log(space.ratio);
      if(space.ratio){
        // console.log("ratio:", space.ratio);
        space.height = space.width / space.ratio;
      }

      space.startDragX = event.clientX;
      space.startDragY = event.clientY;
      
    },
    stopResize(space) {
      space.isResizing = false;
      document.removeEventListener('mousemove', this.currentResizeHandler);
      document.removeEventListener('mouseup', this.currentStopResizeHandler);
    },
    FocusingSpace(space) {
      if (this.focusSpace) {
        this.focusSpace.isBoundaryVisible = false;
      }
      this.updateFocusSpace(space); 
      if(this.focusSpace){
        space.isBoundaryVisible = true;
        console.log("focusSpace:" ,space);
      }
    },
    // 添加文本空间
    addTextSpace() {
      this.mediaNode.textSpaces.push({
        id: Date.now(),
        x: 0,
        y: 0,
        width: 100,
        height:  50,
        content: '輸入文字',
        isBoundaryVisible: true,
        fontSize: '16px',
        fontFamily: 'Arial',
        textAlign: 'left',
        ratio: null,
        type:"text"
      });
      console.log(this.mediaNode.textSpaces);
      this.FocusingSpace(this.mediaNode.textSpaces[this.mediaNode.textSpaces.length - 1]);  
    },
     // 添加文本空间
     addMediaSpace() {
      this.mediaNode.mediaSpaces.push({
        id: Date.now(),
        x: 0,
        y: 0,
        width: 100,
        height:  100,
        file: null,
        type: null,
        url: null,
        file_width: 0,
        file_height: 0,
        isBoundaryVisible: true,
        ratio: null,
      });
      console.log(this.mediaNode.mediaSpaces);
      this.FocusingSpace(this.mediaNode.mediaSpaces[this.mediaNode.mediaSpaces.length - 1]);  
    },


    // 双击文本空间以编辑
    editSpace(space) {
      console.log("Editing space:", space);
      //this.FocusingSpace(space);
      space.isEditing = true; // 確保設置 isEditing 為 true 以顯示 textarea
    },

    startDrag(event, space) {
      console.log(event.target.tagName);
      if (event.target.tagName === 'TEXTAREA') {
        // 如果点击的是 textarea，则不触发拖动
        return;
      }

      event.preventDefault();
      space.startX = event.clientX - space.x;
      space.startY = event.clientY - space.y;

      this.doDragHandler = (e) => this.doDrag(e, space);
      this.stopDragHandler = () => this.stopDrag(space);

      document.addEventListener('mousemove', this.doDragHandler);
      document.addEventListener('mouseup', this.stopDragHandler);
    },

    doDrag(event, space) {
      let newX = event.clientX - space.startX;
      let newY = event.clientY - space.startY;

      // 限制 newX 和 newY 以确保 text-space-wrapper 不会超出 mediaNode
      newX = Math.max(0, Math.min(newX, this.mediaNode.width - space.width));
      newY = Math.max(0, Math.min(newY, this.mediaNode.height - space.height));

      // 仅更新 text-space-wrapper 的位置
      space.x = newX;
      space.y = newY;
    },
    stopDrag(space) {
      // 移除事件處理器
      document.removeEventListener('mousemove', this.doDragHandler);
      document.removeEventListener('mouseup', this.stopDragHandler);
    },

    textSpaceStyle(space) {
      return {
        position: 'absolute',
        top: space.y + 'px',
        left: space.x + 'px',
        width: space.width + 'px',
        height: space.height + 'px',
        border: '1px solid #000',
        overflow: 'hidden',
      };
    },
    textSpaceWrapperStyle(space) {
      return {
        position: 'absolute',
        top: space.y + 'px',
        left: space.x + 'px',
        width: space.width + 'px',
        height: space.height + 'px',
        cursor: 'move', // 添加鼠标移动光标提示
        border: space.isBoundaryVisible ? '1px solid #000' : 'none',
      };
    },

    mediaSpaceStyle(space) {
      return {
        position: 'absolute',
        top: space.y + 'px',
        left: space.x + 'px',
        width: space.width + 'px',
        height: space.height + 'px',
        border: '1px solid #000',
        overflow: 'hidden',
      };
    },
    mediaSpaceWrapperStyle(space) {
      return {
        position: 'absolute',
        top: space.y + 'px',
        left: space.x + 'px',
        width: space.width + 'px',
        height: space.height + 'px',
        cursor: 'move', // 添加鼠标移动光标提示
        border: space.isBoundaryVisible ? '1px solid #000' : 'none',
      };
    },
    getJsonFromDb(){
      let url = 'https://horizonvision.ljthub.com/bg2/getpagejson.php?nodeid=' + this.nodeid;
      fetch(url).then(response => response.json()).then(data => {
        console.log(data);
        this.mediaNode = data;
        this.mediaNode.mediaSpaces.forEach(space => {
          console.log(space);
          //if can't not load file
          if(space.url){
            //load file from server
            console.log('https://horizonvision.ljthub.com/bg2/upload/'+this.nodeid+space.id);
            let url = 'https://horizonvision.ljthub.com/bg2/upload/'+this.nodeid+space.id;
            this.loadFile(null, space, url);

            // this.loadFile('https://horizonvision.ljthub.com/bg2/upload/'+this.nodeid+space.id, space);
          }
          
        });
      });
    },
    async uploadFile(file,name) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            // 設定上傳完成後的處理方式
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log('上傳成功', xhr.responseText);
                    resolve(xhr.responseText);
                } else {
                    console.error('上傳失敗:', xhr.statusText);
                    reject(xhr.statusText);
                }
            };

            // 設定上傳過程中的處理方式，包括進度條的更新
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    console.log(`上傳進度: ${percentComplete.toFixed(2)}%`);
                }
            };

            // 設定上傳失敗的處理方式
            xhr.onerror = () => reject(xhr.statusText);

            xhr.open('POST', 'https://horizonvision.ljthub.com/bg2/uploadfile.php', true);
            xhr.send(formData);
        });
    },
    
    // 其他方法...
  },mounted() {
      this.nodeid = this.$route.params.node_id;
      // 檢查 nodeId 是否存在，如果不存在，則創建一個新的
      if (!this.nodeid) {
        alert('Node ID 不存在');
      }

      console.log('nodeid:', this.nodeid);
      this.getJsonFromDb();
    
    this.beforeUnloadListener = (event) => {
      if (!this.saved) {
        event.preventDefault();
        event.returnValue = ''; // 根據標準，設置returnValue以提示用戶
      }
    };

    window.addEventListener('beforeunload', this.beforeUnloadListener);


    watch(() => this.mediaNode, () => {
        this.UnsavedChanges();
        if(this.changingTimer) clearTimeout(this.changingTimer);
        this.changingTimer = setTimeout(() => {
          this.generateJsonAndThumbnail();
        }, 1000);
      }, {
        deep: true // 使用深度監聽來監聽對象內部變化
      });
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeUnloadListener);
  }
}


</script>

<style>
.preview-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 确保容器填满整个视口高度 */
  width: 100vw; /* 确保容器填满整个视口宽度 */
}

.toolbar {
  width: 100%;
  height: 10%; /* 工具栏占总高度的 10% */
  position: sticky; /* 在向上滚动到达顶部时固定位置 */
  top: 0; /* 固定在顶部 */
  background-color: #f9f9f9; /* 背景色，确保工具栏背景和内容区分开 */
  z-index: 1000; /* 确保工具栏在内容上方 */
  /* 更多样式：如阴影、边框等 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 24px;
}

.media-node-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.media-node {
  position: relative; /* 这是关键 */
  width: 200px;
  height: 150px;
  background-color: #eee;
  border: 1px solid #ccc;
}

.media-node {
  width: 200px; /* 初始宽度 */
  height: 150px; /* 初始高度 */
  background-color: #eee; /* 背景颜色以区分 */
  border: 1px solid #ccc; /* 边框以区分 */
  /* 可以添加更多样式以模拟实际的 MediaNode 外观 */
}

.handle {
  position: absolute;
  background-color: #f00;
  width: 10px;
  height: 10px;
}
  
.top { top: -5px; left: 50%; transform: translateX(-50%); }
.right { top: 50%; right: -5px; transform: translateY(-50%); }
.bottom { bottom: -5px; left: 50%; transform: translateX(-50%); }
.left { top: 50%; left: -5px; transform: translateY(-50%); }
  
.corner {
  position: absolute;
  background-color: #00f;
  width: 10px;
  height: 10px;
}
  
.top-left { top: -5px; left: -5px; }
.top-right { top: -5px; right: -5px; }
.bottom-left { bottom: -5px; left: -5px; }
.bottom-right { bottom: -5px; right: -5px; }

  .text-space-wrapper {
    position: relative; /* 让内部的 text-space 可以相对于它定位 */
    width: 100px; /* 设置 text-space-wrapper 的初始宽度 */
    height: 50px; /* 设置 text-space-wrapper 的初始高度 */
    background-color: transparent; /* 可以看到 text-space-wrapper 的范围 */
  }


  .text-space {
    position: absolute;
    top: 5px; /* 添加单位 px */
    left: 5px; /* 添加单位 px */
    right: 5px; /* 添加单位 px */
    bottom: 5px; /* 添加单位 px */
    box-sizing: border-box;
  }

  .text-space textarea {
    width: 100%; /* 使 textarea 完全填充其容器 */
    height: 100%; /* 同上 */
    border: none; /* 可选，去除内部 textarea 的边框 */
    box-sizing: border-box; /* 确保 padding 和 border 不会扩大 textarea */
    resize: none; /* 可选，禁止用户调整大小 */
    background-color: transparent; /* 可选，使 textarea 背景透明 */
  }

  .media-space{
    position: absolute;
    top: 5px; /* 添加单位 px */
    left: 5px; /* 添加单位 px */
    right: 5px; /* 添加单位 px */
    bottom: 5px; /* 添加单位 px */
    box-sizing: border-box;
  }

  .media-space button{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }

  /* 按钮的样式 */
  .media-space button {
    display: flex; /* 使用flex布局 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    width: 100%; /* 按钮宽度填满容器 */
    height: 100%; /* 按钮高度填满容器 */
    padding: 0; /* 移除内边距 */
    border: none; /* 移除边框 */
    background-color: transparent; /* 透明背景 */
    cursor: pointer; /* 鼠标样式 */
  }


  /* 图标的样式 */
  .material-icons {
    font-size: 5vw; /* 图标大小为父元素（即按钮）字体大小的70% */
    color: lightblue; /* 图标颜色 */
  }

  /* 调整按钮字体大小以控制图标大小 */
  .media-space button {
    font-size: 24px; /* 调整此值以改变图标大小 */
  }

  .resulting {

  }

  .resulting img{
    widows: 100px;
    height: 100px;
  }


</style>

