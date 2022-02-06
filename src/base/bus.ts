import Vue from 'vue';

const EventHandlerConstants = {
    SET_ASSET_ORIGINAL_SOLUTIONS: 'setAssetOriginalSolutions',


    // dashboard =============================================
    REMOVE_WIDGET: 'remove_widget',
    RESIZE_WIDGET: 'resize_widget:>widgetId=',

    ACTIVATE_EDITOR_SIDEBAR: 'activate_editor_sidebar',
    ON_APPLY_EDITOR_SIDEBAR: 'on_apply_editor_sidebar',

};

const eventBus = new Vue({});
export { EventHandlerConstants, eventBus };
