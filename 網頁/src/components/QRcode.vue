<template>
    <div v-component-name="'QRcode'">
        <div v-if="nodeHandleStore.QRcode==='edit'||nodeHandleStore.QRcode==='display'" class="qr-code-container">
            <div v-if="value!=null">
                <qrcode-vue3 :value="value+'?'+nodeHandleStore.QRcode" :width="width" :height="height" :qrOptions="qrOptions" :dotsOptions="dotsOptions"  :key="nodeHandleStore.QRcode"/>
            </div>
            
            <!-- <p> {{value}} </p> -->
        </div>        
        <div v-else>         
        </div>  
    </div>
</template>

<script setup>
import { ref ,watch} from 'vue';
import QrcodeVue3 from "qrcode-vue3";
import { useNodeHandleStore } from '../stores/NodeHandle';
import { useDBHandleStore } from '../stores/DBHandle';
import { useApi } from "../composables/UseApi";

const nodeHandleStore = useNodeHandleStore();
const { QRcode } = nodeHandleStore;
const DBHandleStore = useDBHandleStore();
const { DBNodes,    scenesID     ,   userToken, setNodesByGetPages, getSceneList} = DBHandleStore;
const { data, error, login, register, getScenes, getPages, updatePages, newScene } = useApi();


const value = ref(null);
const width = ref(300);
const height = ref(300);
const qrOptions = ref({
    typeNumber: 0,
    mode:  'Byte',
    errorCorrectionLevel: 'H'
});
const dotsOptions = ref({
    color: '#000',
    type: 'rounded'
}); 
watch(()=> nodeHandleStore.QRcode, (newVal)=>{
    // console.log(" QRcode:", newVal);
    
    getScenes(DBHandleStore.userToken).then(result => {        
        // console.log(" scene:", DBHandleStore.userToken);  
        // console.log(" editToken:", data.value['scenes'][DBHandleStore.scenesID]['editToken'],newVal);
        value.value = data.value['scenes'][DBHandleStore.scenesID]['editToken'];
        console.log(" value:", value.value);
    }); 
    
});

</script>
<style>
.qr-code-container {
  position: fixed; /* Fixed position relative to the viewport */
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Offset the container by half its width and height */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
