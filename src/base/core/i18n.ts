export interface ICoreI18N {
    [key: string]: string;
    ___lang___: string;
    all: string;
    load: string;
    edit: string;
    ok: string;
    cancel: string;
    columns: string;
    copy: string;
    print: string;
    saveSucceeded: string;
    delete: string;
    areYouSure: string;
    more: string;
    success: string;
    warning: string;
    error: string;
    save: string;
}

const coreI18Ns: { [code: string]: ICoreI18N; } = {};
let coreI18N: ICoreI18N;

export function registerLanguage(i18n: ICoreI18N, active?: boolean) {
    return registerI18N(i18n, active);
}

export function registerI18N(i18n: ICoreI18N, active?: boolean) {
    coreI18Ns[i18n.___lang___] = i18n;

    if (active) {
        coreI18N = i18n;
    }
}

export function setI18N(code: string) {
    const i18n = coreI18Ns[code.toLowerCase()];
    if (!i18n) {
        throw new Error('Could not find translation for ' + code);
    }

    coreI18N = i18n;
}

export function getCoreI18N(code?: string) {
    return code ? coreI18Ns[code.toLowerCase()] : coreI18N;
}

export function getI18N<T extends ICoreI18N>() {
    return <T>coreI18N;
}

export function getResource(key: string, code?: string) {
    const i18n = code ? coreI18Ns[code] : coreI18N;
    return (i18n && i18n[key]) || key;
}

export const tr: ICoreI18N = {
    ___lang___: 'tr',
    all: 'Tümü',
    load: 'Yükle',
    edit: 'Düzenle',
    ok: 'Tamam',
    cancel: 'İptal',
    columns: 'Sütunlar',
    copy: 'Kopyala',
    print: 'Yazdır',
    saveSucceeded: 'Kayıt başarılı',
    delete: 'sil',
    areYouSure: 'Emin misiniz?',
    more: 'Daha fazla...',
    success: 'Başarılı',
    warning: 'Uyarı',
    error: 'Hata!',
    save: 'Kaydet'
};

export const en: ICoreI18N = {
    ___lang___: 'en',
    all: 'All',
    load: 'Load',
    edit: 'Edit',
    ok: 'Ok',
    cancel: 'Cancel',
    columns: 'Columns',
    copy: 'Copy',
    print: 'Print',
    saveSucceeded: 'Save succeeded',
    delete: 'delete',
    areYouSure: 'Are you sure?',
    more: 'More...',
    success: 'Success',
    warning: 'Warning',
    error: 'Error!',
    save: 'Save'
};

registerI18N(tr, true);
registerI18N(en);
