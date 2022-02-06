import Cookies from 'js-cookie';
import CryptoJS from "crypto-js";


const TokenKey = 'vue_admin_identity_token';

export function getUsername() {
    return Cookies.get('vue-username');
}
export function getIsAdmin() {
    return Cookies.get('vue-is-admin');
}
export function getLanguageCode() {
    return Cookies.get('language');
}
export function setLanguageCode(language) {
    return Cookies.set('language',language);
}

export function getToken() {
    let cipherText = Cookies.get(TokenKey);
    if (cipherText) {
        let bytes = CryptoJS.AES.decrypt(cipherText, "alg666");
        let token = bytes.toString(CryptoJS.enc.Utf8);
        return token;
    } 
    return cipherText;
}

export function setToken(token, expires) {
    let cipherText = CryptoJS.AES.encrypt(token + "", "alg666").toString();
    if (expires)
        return Cookies.set(TokenKey, cipherText, {
            expires: 1 / ((24 * 60 * 60) / expires)
        });
    else return Cookies.set(TokenKey, cipherText);
}

export function removeToken() {
    Cookies.remove('vue-username');
    Cookies.remove('vue-is-admin');
    return Cookies.remove(TokenKey);
}

export function isLoggedIn() {
    const authToken = getToken();
    return !!authToken;
}

export function isLoginPage() {
    return window.location.href.split('/').reverse()[0].indexOf("Login") > -1;
}

export function logoutUser() {
    removeToken();
}

export function loginUser(user, token, expiresInSeconds) {
    localStorage.removeItem('menus');
    setToken(token, expiresInSeconds);
    setUserName(user.username);
    setIsAdmin(user.isAdmin)
}

export function getState() {
    return Cookies.get(StateKey);
}

export function setUserName(username, expires) {
    if (expires)
        return Cookies.set('vue-username', username, {
            expires: 1 / ((24 * 60 * 60) / expires)
        });
    else return Cookies.set('vue-username', username);
}


export function setIsAdmin(isAdmin, expires) {
    if (expires)
        return Cookies.set('vue-is-admin', isAdmin, {
            expires: 1 / ((24 * 60 * 60) / expires)
        });
    else return Cookies.set('vue-is-admin', isAdmin);
}



export function setUserId(userid, expires) {
    if (expires)
        return Cookies.set('vue-userid', userid, {
            expires: 1 / ((24 * 60 * 60) / expires)
        });
    else return Cookies.set('vue-userid', userid);
}

export function setTenantInfo(tenantInfo, expires) {
    if (expires)
        return Cookies.set('vue-tenantInfo', tenantInfo, {
            expires: 1 / ((24 * 60 * 60) / expires)
        });
    else return Cookies.set('vue-tenantInfo', tenantInfo);
}

export function setCseId(cseId, expires) {
    if (expires)
        return Cookies.set('vue-cseId', cseId, {
            expires: 1 / ((24 * 60 * 60) / expires)
        });
    else return Cookies.set('vue-cseId', cseId);
}

export function setState(state, expires) {
    if (expires)
        return Cookies.set(StateKey, state, {
            expires: 1 / ((24 * 60 * 60) / expires)
        });
    else return Cookies.set(StateKey, state);
}

export function setTenantApplicationId(tenantApplicationId) {
    return Cookies.set(TenantApplicationIdKey, tenantApplicationId);
}

export function getTenantApplicationId() {
    return Cookies.get(TenantApplicationIdKey);
}



function ViewIndexDiff(pathArray) {
    return pathArray.findIndex(x => x == 'view') > -1 ? 0 : 1;
}

export function getUrlId() {
    return GetValueFromPath(1);
}

function GetValueFromPath(index) {
    const pathArray = window.location.href.split('/').reverse();
    return pathArray[index - ViewIndexDiff(pathArray)];
}

export function getSystemUniqueNumber() {
    return GetValueFromPath(0);
}