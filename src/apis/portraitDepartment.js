import Request from './base';

class PortraitDepartment {
    constructor() {
        this.http = new Request({ prefixURL: '/api/portrait/department' });
    }

    getDevlopPortraitData(param) {
        return this.http.post('/devlop', param);
    }

}

export default new PortraitDepartment();