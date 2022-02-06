import axios from 'axios'
import { getToken, getOrganizationId, getUsername, getUserId } from '@/utils/auth'

export function getConfig(item) {
    let envUrl;
    let instance;
    if (Object.keys(config).length > 0) {
        envUrl = config[item];
        instance = axios.create({ baseURL: envUrl });
    } else {
        envUrl = process.env[item];
        instance = axios.create({ baseURL: envUrl });
    }
    instance.interceptors.request.use(
        config => {
            config.headers.Authorization = 'Basic ' + getToken();
            config.headers.TenantId = getTenant();
            config.headers['Content-Type'] = 'application/json charset=utf-8';
            config.headers['Access-Control-Allow-Origin'] = '*';
            return config;
        }, error => Promise.reject(error));
    return instance;
}

export function getConfigUsingToken(item, token) {
    let envUrl;
    let instance;
    if (Object.keys(config).length > 0) {
        envUrl = config[item];
        instance = axios.create({ baseURL: envUrl });
    } else {
        envUrl = process.env[item];
        instance = axios.create({ baseURL: envUrl });
    }

    instance.interceptors.request.use(
        config => {
            config.headers.Authorization = 'Basic ' + token;
            config.headers.TenantId = getTenant();
            config.headers['Content-Type'] = 'application/json charset=utf-8';
            config.headers['Access-Control-Allow-Origin'] = '*';
            return config;
        }, error => Promise.reject(error));
    return instance;
}

export function getConfigWithoutAxios(item) {
    let envUrl;
    if (Object.keys(config).length > 0) {
        envUrl = config[item];
    } else {
        envUrl = process.env[item];
    }
    return envUrl;
}

export function getTenant() {
    let tenantId;
    if (Object.keys(config).length > 0) {
        tenantId = config['VUE_APP_TENANT_ID'];
    } else {
        tenantId = process.env['VUE_APP_TENANT_ID'];
    }
    return tenantId;
}

export function getSessionExpiresInSeconds() {
    let tenantId;
    if (Object.keys(config).length > 0) {
        tenantId = config['VUE_APP_SESSION_EXPIRES_IN_SECONDS'];
    } else {
        tenantId = process.env['VUE_APP_SESSION_EXPIRES_IN_SECONDS'];
    }
    return tenantId;
}