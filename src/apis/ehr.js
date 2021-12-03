import Request from './Request';

class Ehr {
  constructor() {
    this.http = new Request({ prefixURL: '/api/ehr' });
  }

  getEmpList (params) {
    return this.http.post('/getEmpList', params);
  }

  getAllThirdDept () {
    return this.http.post('/thirdDept');
  }
  getOrgList (params) {
    return this.http.post('/getOrgList', params);
  }
  getNextOrg (params) {
    return this.http.post('/nextOrg', params);
  }
  getCurrentUserDept () {
    return this.http.post('/currentDept');
  }
  getPrincipalDeptTree () {
    return this.http.post('/principalDeptTree');
  }
  getOrgByCode (params) {
    return this.http.post('/getOrgByCode', params);
  }

  queryDetail (params) {
    return this.http.post('/queryDetail', params);
  }
}

export default new Ehr();
