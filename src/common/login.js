import store from '@/store';

export function getUserinfo() {
    return store.state.permission.userinfo;
}

export function getToken() {
    return store.state.permission.token;
}

export function logout() {

}
