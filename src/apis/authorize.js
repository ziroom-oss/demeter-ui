import Request from './Request';

export const ACCESS_TOKEN = 'demeter-access-token';
export const USER_INFO = 'demeter-userinfo';
class Auth {
  constructor() {
    this.http = new Request({ prefixURL: '/api/common' });
  }

  getAuthorize (params) {
    return this.http.get('/auth/v1');
  }

  doLogin({ username, password, }) {
    return this.http.post('/auth/login', { username, password });
  }

  doLogout() {
    return this.http.get('/auth/logout');
  }
}

export default new Auth();
