import Request from './Request';

class Portrait {
  constructor() {
    this.http = new Request({ prefixURL: '/api/portrait/' });
  }

  getPortrayalInfo (data) {
    return this.http.post('info', data);
  }

  getEmployeeList (data) {
    return this.http.post('list', data);
  }

  getDailyTaskInfo (data) {
    return this.http.post('task', data);
  }

  getEngineeringMetric (data) {
    return this.http.post('metric', data);
  }

  getNewEngineeringMetric (data) {
    return this.http.post('new/metric', data);
  }

  getCtoData (data) {
    return this.http.post('cto', data);
  }

  getCtoDevData (data) {
    return this.http.post('cto/dev', data);
  }

  getCtoOmegaData (data) {
    return this.http.post('cto/omega', data);
  }

  getCtoWorktopData (data) {
    return this.http.post('cto/worktop', data);
  }

  getUserDetail(uid) {
    return this.http.get('user/' + uid);
  }

  getCtoOverview (data) {
    return this.http.post('new/cto/overview', data);
  }
}

export default new Portrait();