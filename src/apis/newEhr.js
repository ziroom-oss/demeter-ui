import Request from './base';

class NewEhr {
    constructor() {
        this.http = new Request({ prefixURL: '/open/api/ehr' });
    }

    getPortraitUserInfo(param) {
        return this.http.get('/userPortraitInfo?uid=' + param);
    }

    getDepartmentList(param) {
        return this.http.get('/departmentList');
    }

    getUserInfo() {
        return this.http.get('/userInfo');
    }
}

export default new NewEhr();