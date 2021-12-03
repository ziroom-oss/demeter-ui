import Request from './base';
class Role {
  constructor() {
    this.http = new Request({ prefixURL: '/api/role' });
  }

  queryRoleList() {
    return this.http.post('/queryRoleList');
  }
}

export default new Role();
