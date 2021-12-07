import Request from './Request';
class Role {
  constructor() {
    this.http = new Request({ prefixURL: '/api/role' });
  }

  queryRoleList(data) {
    return this.http.post('/query', data);
  }
}

export default new Role();
