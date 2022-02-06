import jwtDecode from 'jwt-decode'
import config from '@/config';

export default interface Settings {
    lang?: string;
    dark?: boolean;
    menuVariantMini?: boolean;
    solution?: string;
}


export const getSettings = (): Settings => {
    const _s = localStorage.getItem(config.STORAGE.SETTINGS_KEY);

    try {
        return _s ? JSON.parse(_s) : {};
    } catch (e) {
        return {};
    }
}
export const setConfig = (value: Settings): Settings => {
    const settings = getSettings();
    const saveSettings = {...settings, ...value};
    localStorage.setItem(config.STORAGE.SETTINGS_KEY, JSON.stringify(saveSettings));

    return getSettings();
}
