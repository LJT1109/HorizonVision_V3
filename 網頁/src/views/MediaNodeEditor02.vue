<template>
  <div class="preview-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 工具栏按钮和选项 -->
      <button @click="toggleBoundary(mediaNode)">调整大小</button>
      <input type="number" v-model="mediaNode.width" />
      <input type="number" v-model="mediaNode.height" />
      <input type="range" v-model="mediaNode.scale" min="10" max="200" />
      {{ mediaNode.scale }}%
      <br>
      <button @click="addTextSpace">添加文本空间</button>
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
            
              <!-- <div class="content-view" @dblclick="editSpace(space)">{{ space.content }}</div> -->
            
              <!-- <div class="handle top" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'top')"></div>
              <div class="handle right" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'right')"></div>
              <div class="handle bottom" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'bottom')"></div>
              <div class="handle left" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'left')"></div>
              <div class="corner top-left" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'top-left')"></div>
              <div class="corner top-right" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'top-right')"></div>
              <div class="corner bottom-left" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'bottom-left')"></div> -->
              <div class="corner bottom-right" v-show="space.isBoundaryVisible" @mousedown.prevent="startResize($event, space, 'bottom-right')"></div>
            </div>
          </div>
          
                  
        </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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

      },
      fontSizeOptions: ['2px', '4px', '8px', '12px', '16px', '20px', '24px', '28px', '32px', '64px'], // 字體大小選項
      fontFamilyOptions: ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'], // 字體選項
      textAlignOptions: ['left', 'center', 'right', 'justify'],
    };
  },
  methods: {
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
      });
      console.log(this.mediaNode.textSpaces);
      this.FocusingSpace(this.mediaNode.textSpaces[this.mediaNode.textSpaces.length - 1]);  
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
    // 其他方法...
  },
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



</style>