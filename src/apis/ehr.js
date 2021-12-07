import Request from './Request';

class Ehr {
  constructor() {
    this.http = new Request({ prefixURL: '/api/ehr' });
  }

  getEmpList(params) {
    return this.http.post('/getEmpList', params);
  }

  getOrgList() {
    return this.http.get('/getOrgList');
  }

  getEmpListByDept(params) {
    return this.http.post('/getEmpListByDept', params);
  }

  getNextOrg(params) {
    return this.http.post('/nextOrg', params);
  }

  getOrgByCode(params) {
    return this.http.post('/getOrgByCode', params);
  }

  queryDetail(params) {
    return this.http.post('/queryDetail', params);
  }
}

export default new Ehr();
