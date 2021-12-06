<template>
  <div>
    登录页面
    <el-card>
      <el-form-item label="用户名">
        <el-input v-model="username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="doLogin">登陆</el-button>
      </el-form-item>
    </el-card>
  </div>
</template>

<script>
import store from '@/store';

export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    doLogin() {
      const { username, password } = this;
      if (!username || !password) {
        return alert('请填写必要的登陆信息');
      }
      store.dispatch('permission/doUserLogin', { username, password }).then(() => {
        this.$router.push('/');
      }).catch(error => {
        alert('登陆错误：' + error.message);
      });
      
    }
  }
}
</script>