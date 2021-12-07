import Request from './base';

class Auth {
  constructor() {
    this.http = new Request({ prefixURL: '/open/api/auth' });
  }

  getAuthorize() {
    return this.http.get('/user/role');
  }
}

export default new Auth();
