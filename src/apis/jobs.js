import Request from './Request';
class Jobs {
  constructor() {
    this.http = new Request({ prefixURL: '/api/jobs' });
  }

  listAll() {
    return this.http.get('/');
  }

  getByCode(code) {
    return this.http.get('/code/' + code);
  }

  delete(id) {
    return this.http.delete('/' + id);
  }

  update({ id, name, code }) {
    code = Number(code);
    return this.http.put('/' + id, { name, code });
  }

  create({ name, code }) {
    code = Number(code);
    return this.http.post('/', { name, code });
  }
}

export default new Jobs();
