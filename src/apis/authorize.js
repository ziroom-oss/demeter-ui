import Request from './Request';

class Auth {
  constructor() {
    this.http = new Request({ prefixURL: '/api/common' });
  }

  getAuthorize (params) {
    return this.http.get('/auth/v1');
  }
}

export default new Auth();
