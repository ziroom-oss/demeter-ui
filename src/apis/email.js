import Request from './Request';

class Email {
  constructor() {
    this.http = new Request({ prefixURL: '/api/email' });
  }

  selectSubEmail (data) {
    return this.http.post('/selectSubEmail', data);
  }

  insertEmail (data) {
    return this.http.post('/insertEmail', data);
  }

  deleteEmail (id) {
    return this.http.post('/deleteEmail?id=' + id);
  }

}

export default new Email();
