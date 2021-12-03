import Request from './base';

class NewTask {
    constructor() {
        this.http = new Request({ prefixURL: '/api/task' });
    }

    getReleaseList(params) {
        return this.http.post('/list/release', params);
    }

    changeTaskStatus(id, type, status) {
        return this.http.post('/status/assign?taskId=' + id + '&taskType=' + type + '&taskStatus=' + status);
    }

    getTaskDetail(taskId, taskType) {
        return this.http.post('/detail/all?taskId=' + taskId + "&taskType=" + taskType);
    }

    getAllSkillStatus(){
        return this.http.get('/status/skill');
    }

    getAllSkillLevel() {
        return this.http.get('/skill/level');
    }
}

export default new NewTask();
