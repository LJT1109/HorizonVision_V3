<template>
  <div class="login-container">
    <!-- <img src="/Welcome/Login-BackgroundTitle.svg" alt="Background Title" class="background-title" /> -->

    <div class="login-area">
      <img src="/Welcome/Login-Logo.svg" alt="Logo" class="login-logo" />
      
      <form @submit.prevent="handleLogin">
        <div class="input-wrapper">
          <img src="/Welcome/Login-UserBar.svg" alt="User Bar" class="user-bar" />
          <input type="text" id="username" v-model="username" class="user-input" />
        </div>

        <div class="input-wrapper">
          <img src="/Welcome/Login-PasswordBar.svg" alt="Password Bar" class="password-bar" />
          <input type="password" id="password" v-model="password" class="user-input" />
        </div>

        <button type="submit" class="login-button">
          <img src="/Welcome/Login-LoginButton.svg" alt="Login Button" />
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from "../composables/UseApi";
import { useDBHandleStore } from '../stores/DBHandle';

const DBHandleStore = useDBHandleStore();
const { DBNodes, NodesRefresh,scenesID, userToken, setNodesByGetPages, getSceneList, checkLogin} = DBHandleStore;
const { data, error, login, register, getScenes, getPages, updatePages, newScene } = useApi();
const router = useRouter();
// const username = ref('');
// const password = ref('');
const username = ref('ljt');
const password = ref('910705');

const handleLogin =async () => {
  // 這裡你可以添加登入邏輯，例如發送 API 請求等
  // 如果登入成功，則導航到編輯器頁面
  router.push('/editor');
  if (username.value && password.value) {
    login(username.value, password.value).then(result =>{
      if(result==1){
        sessionStorage.setItem('userToken', data.value.data['token']);
        sessionStorage.setItem('isLoggedin', 'true');

        DBHandleStore.userToken = data.value.data['token'];
        DBHandleStore.checkLogin = true;
        console.log(data.value.data, DBHandleStore.userToken);
        getSceneList();
        router.push('/editor');
      }else{
        router.push('/');
        alert("帳號或密碼錯誤");
      }
    });

  }
};

</script>

<style>
  
  
  .user-input {
    width: 100%;
    height: 60%;
    /*set text size max and vertical center and horzontal center*/
    font-size: 1.5rem;
    
    vertical-align: middle;
    
    /* on click don't show the border */
    outline: none;

  } 

  .login-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: var(--color-aliceblue-200);
  }

  .background-title {
    position: absolute;
    top: 50%;
    left: 50%;
    /* transform: translate(-50%, -50%); */
    z-index: -1;
    width:auto; /* Example fixed width, adjust as needed */
    height: 20%; /* This will keep the aspect ratio of the image */
  }


  .login-area {
    position: relative;
    width: 400px;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background: url('/Welcome/Login-LoginArea.svg');     */
    background-size: contain;
    background-repeat: no-repeat;
    padding: 20px;
  }

  .login-area form {
    width: 80%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .login-logo {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
  }

  .input-wrapper {
    width: 100%;
    height: auto;
    position: relative;
    margin-bottom: 20px;
  }

  .input-wrapper img {
    width: 100%;
    height: auto;
  }

  .input-wrapper input {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    border: none;
    background: transparent;
  }

  .login-button {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .login-button img {
    width: 100%;
    height: auto;
  }
  
</style>
