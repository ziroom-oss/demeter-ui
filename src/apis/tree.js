import Request from './Request';
import { Message } from 'element-ui';
class Tree {
  constructor() {
    this.http = new Request({ prefixURL: '/api/tree' });
  }

  create(tree) {
    return this.http.post('/', tree);
  }

  get(id) {
    return this.http.get('/' + id);
  }

  update(id, tree) {
    return this.http.patch('/' + id, tree);
  }

  delete(id) {
    return this.http.delete('/' + id);
  }

  getNodesByParentId(id) {
    return this.http.get('/parentId/' + id);
  }

  getRootNode() {
    return this.http.get('/' + 100000);
  }

  getAllNodes() {
    return this.http.get('/all');
  }
}

export default new Tree();
