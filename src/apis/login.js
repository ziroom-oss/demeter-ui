import Request from './base';
class Auth {
  constructor() {
    this.http = new Request({ prefixURL: '/open/api' });
  }

  doLogin({ username, password, }) {
    return this.http.post('/login/usernamePassword', { loginName: username, password, });
  }

  doLogout() {
    return this.http.post('/logout');
  }

  getAuth() {
    return this.http.get('/auth/user/role');
  }
}

export default new Auth();
