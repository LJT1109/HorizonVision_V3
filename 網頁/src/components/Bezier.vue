<template>
  <svg v-component-name="'BezierLine'" class="bezier" ref="bezier" :width="canvasWidth" :height="canvasHeight" >
    <path  class="bezierline" v-component-name="'BezierLine'"  :d="bezierPath" stroke="blue" fill="none" />
  </svg>
</template>

<script setup>
import { ref, computed, defineProps, } from 'vue';
const { coordsA, coordsB } = defineProps(['coordsA', 'coordsB']);
const bezier = ref();

const minX = computed(() => Math.min(coordsA.x, coordsB.x, control1.value.x, control2.value.x));
const minY = computed(() => Math.min(coordsA.y, coordsB.y, control1.value.y, control2.value.y));
const canvasHeight = computed(() => Math.max(coordsA.y + 256,coordsB.y + 256,coordsA.y + 110 + 50,coordsB.y + 110 + 50) - Math.min(coordsA.y,coordsB.y,coordsA.y + 110 - 50,coordsB.y + 110 - 50) + minY.value);
const canvasWidth = computed(() => Math.max(coordsA.x + 220, coordsB.x + 220, coordsA.x + 220 + 50,coordsB.x + 50)  -  Math.min(coordsA.x, coordsB.x, coordsA.x + 220 - 50, coordsB.x - 50) + minX.value);
const control1 = ref({ x: coordsA.x + 220 + 50, y: coordsA.y + 110 + 50 });
const control2 = ref({ x: coordsB.x - 50 , y: coordsB.y + 110 - 50 });

const bezierPath = computed(() => {
  // console.log(coordsA,coordsB);
  if(coordsB.x >= coordsA.x && coordsB.y <= coordsA.y){
    control1.value = { x: coordsA.x + 220 + 50, y: coordsA.y + 110 - 50 };
    control2.value = { x: coordsB.x - 50 , y: coordsB.y + 110 + 50 };
  }
  else if(coordsB.x <= coordsA.x && coordsB.y >= coordsA.y){
    control1.value = { x: coordsA.x + 220 - 50, y: coordsA.y + 110 + 50 };
    control2.value = { x: coordsB.x + 50 , y: coordsB.y + 110 - 50 };
  }
  else if(coordsB.x <= coordsA.x && coordsB.y <= coordsA.y){
    control1.value = { x: coordsA.x + 220 - 50, y: coordsA.y + 110 - 50 };
    control2.value = { x: coordsB.x + 50 , y: coordsB.y + 110 + 50 };
  }
  else{
    control1.value = { x: coordsA.x + 220 + 50, y: coordsA.y + 110 + 50};
    control2.value = { x: coordsB.x + 50 , y: coordsB.y + 110 - 50 };
  }
 //console.log(`M ${Math.abs(coordsA.x)} ${Math.abs(coordsA.y )} C ${Math.abs(control1.x)} ${Math.abs(control1.y )}, ${Math.abs(control2.x )} ${Math.abs(control2.y)}, ${Math.abs(coordsB.x)} ${Math.abs(coordsB.y)}`);
  return `M ${coordsA.x + 240} ${coordsA.y + 120} C ${control1.value.x} ${control1.value.y}, ${control2.value.x} ${control2.value.y}, ${coordsB.x + 16} ${coordsB.y + 120}`;
  // return `M ${coordsA.x } ${coordsA.y } C ${control1.value.x} ${control1.value.y}, ${control2.value.x} ${control2.value.y}, ${coordsB.x} ${coordsB.y}`;
});


</script>

<style>
.bezier {
  position: absolute;
  top: 0;
  left: 0;  
  user-select: none;-webkit-user-select: none;
  pointer-events: none;
  z-index:  0;  
}
.bezierline{
  
  pointer-events: auto;
}
.bezierline:hover {
  stroke : black;
}
</style>
