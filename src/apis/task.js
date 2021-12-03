import Request from './Request';

class Task {
  constructor() {
    this.http = new Request({ prefixURL: '/api/task' });
  }

  saveAssign (data) {
    return this.http.post('/save/assign', data);
  }

  getAssignTask (id) {
    return this.http.post('/get/assign?id=' + id);
  }

  editAssign (data) {
    return this.http.post('/update/assign', data);
  }

  editSkill (data) {
    return this.http.post('/update/skill', data);
  }

  changeTaskStatus (id, type, status) {
    return this.http.post('/status/assign?taskId=' + id + '&taskType=' + type + '&taskStatus=' + status);
  }

  getAllTaskTypes () {
    return this.http.get('/type/all');
  }

  getAllAssignStatus () {
    return this.http.get('/status/assign');
  }

  getAllSkillStatus () {
    return this.http.get('/status/skill');
  }

  getAllAssignFlowStatus () {
    return this.http.get('/status/flow/assign');
  }

  getAllSkillFlowStatus () {
    return this.http.get('/status/flow/skill');
  }

  getAllSkillLevel () {
    return this.http.get('/skill/level');
  }

  releaseList (data) {
    return this.http.post('/list/release', data);
  }

  receiveList (data) {
    return this.http.post('/list/receive', data);
  }

  getTaskDetail (taskId, taskType) {
    return this.http.post('/detail/all?taskId=' + taskId + "&taskType=" + taskType);
  }
  getStudyListDetail(manifestid){
    return this.http.post('/get/skill/manifest/detail?manifestId='+ manifestid);
  }
  createManifest (data) {
    return this.http.post('/create/skill/manifest', data);
  }
  modifyManifest(data) {
    return this.http.post('/modify/skill/manifest', data);
  }
  deleteManifestSkill(manifestId, taskId) {
    return this.http.delete(`/skill/manifest/${manifestId}/task/${taskId}`);
  }
  deleteManifestSkillLearnPath(id) {
    return this.http.delete(`/skill/manifest/learnpath/${id}`);
  }
  // 创建单条学习路径
  createSkillLearnPath(taskUserId, taskId, path) {
    return this.http.post(`/create/skill/manifest/taskuser/${taskUserId}/task/${taskId}`, { path });
  }
  // 创建单条技能任务到学习清单
  createSkillTaskIntoManifest(manifestId, taskId, learnerUid) {
    return this.http.post(`/create/skill/manifest/${manifestId}/task/${taskId}/learner/${learnerUid}`);
  }

  // getAssignTaskCheckList (taskId, taskType) {
  //   return this.http.post('/receiver/list?taskId=' + taskId + "&taskType=" + taskType);
  // }

  acceptTask (taskId, taskType) {
    return this.http.post('/accept?id=' + taskId + "&type=" + taskType);
  }

  rejectTask (data) {
    return this.http.post('/reject', data);
  }

  getRejectReason (data) {
    return this.http.post('/reject/reason', data);
  }

  reassignTask(data) {
    return this.http.post('/reassign', data);
  }

  submitCheckTask (taskId, taskType) {
    return this.http.post('/submit/auth?taskId=' + taskId + "&taskType=" + taskType);
  }

  submitComplete (taskId) {
    return this.http.post('/submit/complete?taskId=' + taskId);
  }

  checkTask (data) {
    return this.http.post('/auth', data);
  }

  finishTaskCondition (id) {
    return this.http.post('/condition/finish?id=' + id);
  }

  getTaskProgress (id) {
    return this.http.post('/detail/progress?id=' + id);
  }

  searchTask (condition) {
    return this.http.post('/graph/search?condition=' + condition);
  }

  submitSkillMove (id, skillTreeId) {
    return this.http.post('/skill/move?id=' + id + "&skillTreeId=" + skillTreeId);
  }

  uploadLearningOutcome (data) {
    return this.http.post('/upload/outcome', data);
  }

  //展示登录用户分配出的学习清单
  getStudyListCurUser(data){
    return this.http.post('/list/skill/manifest', data);
  }


}

export default new Task();
