import Request from './base';
import { Message } from 'element-ui';
class Tree {
  constructor() {
    this.http = new Request({ prefixURL: '/api/tree' });
  }

  create(param) {
    return this.http.post('/create', param);
  }

  get(treeId) {
    return this.http.get('/getTreeNodeById?treeId=' + treeId);
  }

  update(param) {
    return this.http.post('/update', param);
  }

  delete(treeId) {
    return this.http.post('/deleteById?treeId=' + treeId);
  }

  getNodesByParentId(parentId) {
    return this.http.get('/getTreeNodesByParentId?parentId=' + parentId);
  }

  getRootNode() {
    return this.http.get('/getTreeNodeById?treeId=100000');
  }

  getAllNodes() {
    return this.http.get('/getAllTreeNodes');
  }
}

export default new Tree();
