import i18n from "@/plugins/i18n";

export const Periods = [
    { text: i18n.t('common.hour').toString(), value: 1 },
    { text: i18n.t('common.day').toString(), value: 2 },
    { text: i18n.t('common.week').toString(), value: 3 },
    { text: i18n.t('common.month').toString(), value: 4 }

]
export const Graphics = [
    { text: 'Combo Chart', value: 'ComboChart'},
    { text: 'Column Chart', value: 'ColumnChart'},
    { text: 'Line Chart', value:'LineChart' },
    { text: 'Area Chart', value: 'AreaChart' },
    { text: 'Stepped Area Chart', value: 'SteppedAreaChart' }
]