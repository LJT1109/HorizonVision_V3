<template>
    <div class="media-node">
        <div class="node handle top" @mousedown.prevent="startResize($event, null, 'top')"></div>
        <div class="node handle right" @mousedown.prevent="startResize($event, null, 'right')"></div>
        <div class="node handle bottom" @mousedown.prevent="startResize($event, null, 'bottom')"></div>
        <div class="node handle left" @mousedown.prevent="startResize($event, null, 'left')"></div>
        <div class="node corner top-left" @mousedown.prevent="startResize($event, null, 'top-left')"></div>
        <div class="node corner top-right" @mousedown.prevent="startResize($event, null, 'top-right')"></div>
        <div class="node corner bottom-left" @mousedown.prevent="startResize($event, null, 'bottom-left')"></div>
        <div class="node corner bottom-right" @mousedown.prevent="startResize($event, null, 'bottom-right')"></div>
    </div>
</template>

<script>
export default{
    data() {
      return {
        
        currentResizeHandler: null,
        currentStopResizeHandler: null,
        mediaNode: {
            isResizing: false,
            x: 0,
            y: 0,
            width: 200,
            height: 200,
            isResizing: false,
            startDragX: 0,
            startDragY: 0,
            ratio:null,
        }
      };
    },
    methods: {
        startResize(event, space, direction) {
            if(space===null){
                //space 是整個 media-node
                space = this.mediaNode;
            }

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
        if(space===null){
            //space 是整個 media-node
            space = this.mediaNode;
        }
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

        if(space.ratio){
            space.height = space.width * space.ratio;
        }

        space.startDragX = event.clientX;
        space.startDragY = event.clientY;
    },

    stopResize(space) {
        if(space===null){
            //space 是整個 media-node
            space = this.mediaNode;
        }
        if (!space.isResizing) return;
        
        space.isResizing = false;
        // 移除全局事件监听器
        // 使用保存的引用移除监听器
        document.removeEventListener('mousemove', this.currentResizeHandler);
        document.removeEventListener('mouseup', this.currentStopResizeHandler);

        // 清除引用
        this.currentResizeHandler = null;
        this.currentStopResizeHandler = null;
    }
    },
}

</script>


<style>
    .media-node {
        background-color: antiquewhite;
        position: relative;  /* 关键：确保子元素的绝对定位是相对于此元素 */
        width: 200px;  /* 初始宽度，可根据需要调整 */
        height: 200px;  /* 初始高度，可根据需要调整 */
        /* 可选：为了更清楚地看到效果，可以设置边框 */
        border: 1px solid #000;
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