import Request from './Request';

class SkillPoint {
  constructor() {
    this.http = new Request({ prefixURL: '/api/skill' });
  }

  saveSkillPoint(data) {
    return this.http.post('/save', data);
  }

  getSkillTask(id) {
    return this.http.post('/get?id=' + id);
  }

  updateSkillPoint(data) {
    return this.http.post('/update', data)
  }

  querySkillPoint(data) {
    return this.http.post('/query?skillTreeId=' + data);
  }

  batchQuery(data) {
    return this.http.post('/batchQuery', data);
  }

  getSkillPointsCheckList(data) {
    return this.http.post('/check/list', data);
  }

  qa(data) {
    return this.http.post('/q/a', data);
  }
}

export default new SkillPoint();
