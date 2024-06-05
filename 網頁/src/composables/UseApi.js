// api.js
import { ref } from 'vue';
import axios from 'axios';

export function useApi() {
  const data = ref(null);
  const error = ref(null);

  const login = async (name, password) => {
    try {
      const response = await axios.get(`https://horizonvision.ljthub.com/bg2/login_v2.php?name=${name}&password=${password}`);
      data.value = response;
      return response.data['success'];
    } catch (e) {
      error.value = e;
    }
  };

  const register = async (name, password, email) => {
    try {
      const response = await axios.get(`https://horizonvision.ljthub.com/bg2/register.php?name=${name}&password=${password}&email=${email}`);
      data.value = response.data;
    } catch (e) {
      error.value = e;
    }
  };

  const getScenes = async (token) => {
    try {
      const response = await axios.get(`https://horizonvision.ljthub.com/bg2/getSceneInfo.php?token=${token}`);
      data.value = response.data;
    } catch (e) {
      error.value = e;
    }
  };

  const getPages = async (token) => {
    try {
      const response = await axios.get(`https://horizonvision.ljthub.com/bg2/getPageInfo.php?token=${token}`);
      
      data.value = response.data;
    } catch (e) {
      error.value = e;
    }
  };

  const updatePages = async (updateData,sid) => {
    try {
      const formData = new FormData();
      formData.append('pages', updateData);
      formData.append('sid', sid);
      // console.log(formData);
      const response = await axios.post('https://horizonvision.ljthub.com/bg2/updatePages_v2.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      data.value = response.data;
      console.log(response.text);
      console.log(response.status);
    } catch (e) {
      error.value = e;
    }
  };
  

  const newScene = async (token, scene_name) => {
    try {
      const response = await axios.get(`https://horizonvision.ljthub.com/bg2/insertNewScene.php?token=${token}&scene_name=${scene_name}&expert_mode=1`);
      data.value = response.data;
      // console.log(`https://horizonvision.ljthub.com/bg2/insertNewScene.php?token=${token}&scene_name=${scene_name}&expert_mode=1`);
    } catch (e) {
      error.value = e;
    }
  };
  
  const uploadFile = async (file, token, type) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token);
      formData.append('type', type);
  
      const response = await axios.post('https://horizonvision.ljthub.com/bg2/uploadFile.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      data.value = response.data;
      console.log(response.status);
    } catch (e) {
      error.value = e;
    }
  };
  
  return {
    data,
    error,
    login,
    register,
    getScenes,
    getPages,
    updatePages,
    newScene,
    uploadFile, 
  };
}
