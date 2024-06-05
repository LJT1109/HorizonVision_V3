<template>
  <div :class="props.buttonName" v-component-name="`${props.buttonName}`">
    <span :class="props.buttonName">
      <img class="normal-icon" :src="getIconSrc('')" />
      <img class="hover-icon" :src="getIconSrc('-hover')" />
      <img class="press-icon" :src="getIconSrc('-click')" />
    </span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['buttonName']);

const getIconSrc = (state) => {
  let basePath = '/addNode/';
  let iconName = '';
  switch (props.buttonName) {
    case 'AddTextNode':
      iconName = 'TextButton';
      break;
    case 'AddImageNode':
      iconName = 'ImageButton';
      break;
    case 'AddVideoNode':
      iconName = 'VideoButton';
      break;
  }
  return `${basePath}${iconName}${state}.svg`;
};

</script>

<style>
.AddTextNode,
.AddImageNode,
.AddVideoNode {
  position: relative;
  width: 48px;
  height: 48px;
  z-index: 100;
}
.normal-icon,
.hover-icon,
.press-icon {
  width: 48px;
  height: 48px;
  display: none;
  z-index: 100;
}

.AddTextNode .normal-icon,
.AddImageNode .normal-icon,
.AddVideoNode .normal-icon {
  width: 48px;
  height: 48px;
  display: block;
  z-index: 100;
}


.AddTextNode:hover .normal-icon,
.AddImageNode:hover .normal-icon,
.AddVideoNode:hover .normal-icon {
  display: none;
  z-index: 100;
}

.AddTextNode:hover .hover-icon,
.AddImageNode:hover .hover-icon,
.AddVideoNode:hover .hover-icon {
  width: 48px;
  height: 48px;
  display: block;
  z-index: 100;
}

.AddTextNode:active .press-icon,
.AddImageNode:active .press-icon,
.AddVideoNode:active .press-icon {
  width: 48px;
  height: 48px;
  display: block;
  z-index: 100;
}

.AddTextNode:active .hover-icon,
.AddImageNode:active .hover-icon,
.AddVideoNode:active .hover-icon {
  width: 48px;
  height: 48px;
  display: none;
  z-index: 100;
}
</style>
