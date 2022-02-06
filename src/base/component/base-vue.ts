import Vue from 'vue'
import { eventBus } from '../bus'

declare let $: any;

export class BaseVue extends Vue {

    constructor() {
        super();
    }

    private static _jobCount = 0;

    static trackPromise<T = any>(promise: PromiseLike<T>): PromiseLike<T> {
        BaseVue.isBusy = true;

        return promise.then(
            d => {
                BaseVue.isBusy = false;
                return d;
            },
            e => {
                BaseVue.isBusy = false;
                return Promise.reject(e);
            }
        );
    }

    static get isBusy(): boolean {
        return BaseVue._jobCount > 0;
    }

    static set isBusy(value: boolean) {
        BaseVue._jobCount += (value ? 1 : -1);
        eventBus.$emit('busy', BaseVue._jobCount > 0);
    }

    trackPromise<T = any>(promise: PromiseLike<T>): PromiseLike<T> {
        return BaseVue.trackPromise(promise);
    }

    get isBusy(): boolean {
        return BaseVue.isBusy;
    }

    set isBusy(value: boolean) {
        BaseVue.isBusy = value;
    }

    hideConfirm() {
        eventBus.$emit('confirm-hide');
    }

    showPopup(popupId) {
        (<any>$(`#${popupId}`)).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    hidePopup(popupId) {
        (<any>$(`#${popupId}`)).modal('hide');
    }
}