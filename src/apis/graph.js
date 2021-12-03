import Request from './Request';
import Axios from 'axios';
class Graph {
  constructor() {
    this.http = new Request({ prefixURL: '/api/graph' });
  }

  listGraph(params) {
    return this.http.post('/list', params,);
  }

  deleteGraph(id) {
    return this.http.delete('/?id=' + id);
  }

  listGraphAll() {
    return this.http.get('/list/all');
  }

  // graphId 图谱 id
  listGraphArea(id) {
    return this.http.get('/area/list' + '?graphId=' + id);
  }

  deleteGraphArea(id) {
    return this.http.delete('/area?id=' + id);
  }

  deleteSubSkill(id) {
    return this.http.delete('/subSkill?id=' + id);
  }

  // skillId 父级技能 id
  listSubSkill(skillId) {
    return this.http.get('/subSkill/list?skillId=' + skillId);
  }

  createOrModGraph(graph) {
    return this.http.post('/', graph);
  }

  createOrModArea(graphArea) {
    return this.http.post('/area', graphArea);
  }

  createOrModSubSkill(subSkillTasks) {
    const reqs = subSkillTasks.map(item => this.http.post('/subSkill', item));
    return Promise.all(reqs);
  }

  listTechRanks() {
    return this.http.get('/tech/ranks');
  }

  listPositions() {
    return this.http.get('/positions');
  }

}

export default new Graph();
