import { computed, readonly, ref } from "vue";
import { defineStore } from "pinia";
import { useApi } from "../composables/UseApi";
import { useRouter } from 'vue-router';
export const useDBHandleStore = defineStore("DBHandle", () => {
    const DBNodes = ref([]);
    const NodesRefresh = ref(false);
    const { data, error, login, register, getScenes, getPages, updatePages, newScene } = useApi();
    const scenesID = ref(-1);
    const sceneList = ref([]);
    const userToken = ref("");
    const checkLogin = ref(false);

    const setNodesByGetPages = async (token) => {
        DBNodes.value = [];
        // console.log(token);
        try {
            const result = await getPages(token);
            if ( data.value['bodys']) {
                DBNodes.value = data.value;
                // console.log('true',DBNodes.value);
            } else {
                console.error('Data is not available');
            }
        } catch (e) {
            console.error('Error:', e);
        }
    };
    const getSceneList = async () =>{
        sceneList.value = [];
        getScenes(userToken.value).then(result => {
            if (data.value && data.value['scenes']) {
                sceneList.value = data.value['scenes'];
                // console.log("scenelist", sceneList.value);
            } else {
                console.error('Scenes data is not available');
            }            
        }); 
    };
    const addNewScene = async (name) => {
        try {
            await newScene(userToken.value,name);
            const newSceneToken = data.value['editToken'];            
            // console.log(data.value,newSceneToken, "new scene token");
            await getSceneList();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    try{
        if(sessionStorage.getItem('userToken')){
            userToken.value = sessionStorage.getItem('userToken');
            checkLogin.value = true;
        }
    }catch(e){
    }
    
    return {
        DBNodes,
        NodesRefresh,
        scenesID,
        sceneList,
        userToken,
        checkLogin,
        setNodesByGetPages,
        getSceneList,
        addNewScene,
    };
});
