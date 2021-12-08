<template>
  <div class="loginStyle">
    <div style="width:350px; height:550px;text-align:center" >
    <h2>登录页面</h2>
    <el-card class="loginStyle1">
      <el-form>
        <el-form-item  label="用户名">
          <el-input v-model="username" auto-complete="true"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="doLogin">登陆</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

  </div>
  
</template>

<script>
import store from '@/store';

export default {
  data() {
    return {
      username: 'daijk',
      password: '1',
    }
  },
  methods: {
    doLogin() {
      const { username, password } = this;
      if (!username || !password) {
        return alert('请填写必要的登陆信息');
      }
      store.dispatch('doUserLogin', { username, password }).then(() => {
        this.$router.push('/').catch(err => {});
      }).catch(error => {
        alert('登陆错误：' + error.message);
      });
      
    }
  }
}
</script>

<style scoped>
.loginStyle1 {
   width:350px;height:350px;  /*设置div的大小*/
   border:1px solid green;    /*边框*/
   text-align: center;        /*文字水平居中对齐*/
   line-height: 200px;        /*设置文字行距等于div的高度*/
   overflow:hidden;
}
.loginStyle{
  position: absolute;
  left: 50%;
  top: 30%;
  width:200px;
  height:100px;
  margin-left:-100px;
  margin-top:-50px;
}
</style>