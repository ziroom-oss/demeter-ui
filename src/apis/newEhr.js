import Request from './base';

class NewEhr {
    constructor() {
        this.http = new Request({ prefixURL: '/api/ehr' });
    }

    getUserInfo(param) {
        return this.http.get('/userInfo?uid=' + param);
    }

    getDepartmentList(param) {
        return this.http.get('/departmentList');
    }

    getTechRanks() {
        return this.http.get('/job/levels');
    }
}

export default new NewEhr();