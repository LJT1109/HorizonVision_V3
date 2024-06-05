<template>
  <div v-component-name="'NodeConnector'" class="NodeConnector" tabindex="-1" >
    <div class="NodeConnectorColor"></div>
  </div>
</template>

<script setup>

</script>

<style>

.NodeConnector {
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
.NodeConnector:focus>.NodeConnectorColor {
  position: absolute;
  top: 3px;
  left: 3px;
  border-radius: 50%;
  background-color: var(--color-beige);
  box-shadow: 1px 1px 2px rgba(254, 255, 242, 0.3),
    -1px -1px 2px rgba(192, 198, 182, 0.5),
    -1px 1px 2px rgba(192, 198, 182, 0.2) inset,
    1px -1px 2px rgba(192, 198, 182, 0.2) inset,
    -1px -1px 2px rgba(254, 255, 242, 0.9) inset,
    1px 1px 3px rgba(192, 198, 182, 0.9) inset;
  width: 14px;
  height: 14px;
}
</style>
