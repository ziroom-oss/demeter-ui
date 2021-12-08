<template>
  <div>
    登录页面
    <el-card>
      <el-form>
        <el-form-item label="用户名">
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
      store.dispatch('doUserLogin', { username, password }).then(() => {
        this.$router.push('/').catch(err => {});
      }).catch(error => {
        alert('登陆错误：' + error.message);
      });
      
    }
  }
}
</script>