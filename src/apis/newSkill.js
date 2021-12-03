import Request from './base';

class NewSkill {
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
        return this.http.post('/query?skillTreeIds=' + data);
    }
}

export default new NewSkill();
