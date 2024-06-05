<template>
  <div v-component-name="'NodeIn'" class="NodeIn" tabindex="-1">
    <div class="NodeInColor" ></div>
  </div>
</template>
  
<script setup>
</script>
  
<style>
.NodeIn {
  position: absolute;
  border-radius: 50%;
  background-color: var(--color-aliceblue-200);
  box-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3) inset,
    -1px -1px 2px rgba(191, 194, 199, 0.5) inset,
    -5px 5px 10px rgba(191, 194, 199, 0.2),
    5px -5px 10px rgba(191, 194, 199, 0.2),
    -5px -5px 10px rgba(255, 255, 255, 0.9),
    5px 5px 13px rgba(191, 194, 199, 0.9);
  width: 20px;
  height: 20px;
}
.NodeIn:focus>.NodeInColor {
  position: absolute;
  top: 3px;
  left: 3px;
  border-radius: 50%;
  background-color: var(--pink);
  box-shadow: 1px 1px 2px rgba(255, 244, 246, 0.3),
    -1px -1px 2px rgba(218, 184, 186, 0.5),
    -1px 1px 2px rgba(218, 184, 186, 0.2) inset,
    1px -1px 2px rgba(218, 184, 186, 0.2) inset,
    -1px -1px 2px rgba(255, 244, 246, 0.9) inset,
    1px 1px 3px rgba(218, 184, 186, 0.9) inset;
  width: 14px;
  height: 14px;
}
</style>
  