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
        </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentResizeHandler: null,
      currentStopResizeHandler: null,
      mediaNode: {
        isBoundaryVisible: false,
        isResizing: false,
        width: 200,
        height: 150,
        scale: 100,
      },
      // 其他数据...
    };
  },
  methods: {
    toggleBoundary(node) {
      node.isBoundaryVisible = !node.isBoundaryVisible;
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
    doResize(event, space, direction){
      if (!space.isResizing) return;
      console.log("doResize");
      //console.log(direction);
      const dx = event.clientX - space.startDragX;
      const dy = event.clientY - space.startDragY;

      if (direction === 'right') {
        space.width += dx;
      } else if (direction === 'bottom') {
        space.height += dy;
      } else if (direction === 'left') {
        space.width -= dx;
        space.x += dx;
      } else if (direction === 'top') {
        space.height -= dy;
        space.y += dy;
      } else if (direction.includes('top') && direction.includes('left')) {
        space.width -= dx;
        space.x += dx;
        space.height -= dy;
        space.y += dy;
      } else if (direction.includes('top') && direction.includes('right')) {
        space.width += dx;
        space.height -= dy;
        space.y += dy;
      } else if (direction.includes('bottom') && direction.includes('left')) {
        space.width -= dx;
        space.x += dx;
        space.height += dy;
      } else if (direction.includes('bottom') && direction.includes('right')) {
        space.width += dx;
        space.height += dy;
      }

      space.startDragX = event.clientX;
      space.startDragY = event.clientY;
    },
    stopResize(space) {
      space.isResizing = false;
      document.removeEventListener('mousemove', this.currentResizeHandler);
      document.removeEventListener('mouseup', this.currentStopResizeHandler);
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

</style>