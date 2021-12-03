import Request from './base';
class Jobs {
  constructor() {
    this.http = new Request({ prefixURL: '/api/jobs' });
  }

  listAll() {
    return this.http.get('/getPositionList');
  }

  getByCode(code) {
    return this.http.get('/getPositionInfo/' + code);
  }

  delete(id) {
    return this.http.post('/delete?id=' + id);
  }

  update({ id, name, code }) {
    code = Number(code);
    return this.http.post('/update', {id, name, code });
  }

  create({ name, code }) {
    code = Number(code);
    return this.http.post('/create', { name, code });
  }
}

export default new Jobs();
