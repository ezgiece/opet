import Vue, { ComponentOptions as VueComponentOptions } from 'vue'
import VueComponent from 'vue-class-component'
import { BaseVue } from './base-vue'

export interface ComponentOptions<T extends BaseVue> extends VueComponentOptions<T> {
}

export function Component<U extends BaseVue>(options: ComponentOptions<U>) {
    options.created = function () {
        const that = <any>this;
        if (that.createdInternal) {
            that.createdInternal();
        }
    };

    options.mounted = function () {
        const that = <any>this;
        if (that.mountedInternal) {
            that.mountedInternal();
        }
    };

    return VueComponent(options);
}
