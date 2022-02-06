import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop, Watch} from 'vue-property-decorator';

@Component({
    name: 'kd-date-picker'
})
export default class DatePicker extends Vue {
    @Prop({
        required: false,
        default: ''
    })
    initialDate: Array<string> | string;

    @Prop({
        required: false,
        default: false
    })
    hasRangeSelection: boolean;

    @Prop({
        required: false,
        default: false
    })
    hasTimeSelection: boolean;

    @Prop({
        required: false,
        default: ''
    })
    minDate: string;

    @Prop({
        required: false,
        default: ''
    })
    maxDate: string;

    @Prop({
        required: false,
        default: 'Start Date'
    })
    startTitle: string;

    @Prop({
        required: false,
        default: 'End Date'
    })
    endTitle: string;

    @Prop({
        required: false,
        default: 'OK'
    })
    okTitle: string;

    @Prop({
        required: false,
        default: 'CLEAR'
    })
    clearTitle: string;

    @Prop({
        required: false,
        default: 'en'
    })
    locale: string;

    @Prop({
        required: false,
        default: ''
    })
    inputColumnClass: string;

    @Prop({
        required: false,
        default: 'Invalid Time Range'
    })
    invalidTimeRangeText: string;

    @Prop({
        required: false,
        default: () => {
            return [];
        }
    })
    startDateRule: Array<Function>;

    @Prop({
        required: false,
        default: () => {
            return [];
        }
    })
    endDateRule: Array<Function>;

    @Prop({
        required: false,
        default: false
    })
    hideDetails: boolean;

    visualStartDate = '';
    visualEndDate = '';
    startDate = '';
    endDate = '';
    dateRange: any = null;
    timeRange = [
        {
            hour: '0',
            minute: '00'
        },
        {
            hour: '23',
            minute: '59'
        }
    ];

    menu = false;
    tab = 0;
    hourOptions: Array<string> = this.getHourOptions();
    minuteOptions: Array<string> = this.getMinuteOptions();
    message = '';

    created() {
        this.dateRange = this.hasRangeSelection ? [] : '';
        if (this.initialDate) {
            this.setInitialDate();
        }
    }

    getHourOptions(): Array<string> {
        const hours: Array<string> = [];
        for (let index = 0; index < 24; index++) {
            hours.push(index.toString());
        }

        return hours;
    }

    getMinuteOptions(): Array<string> {
        const minutes: Array<string> = [];
        for (let index = 0; index < 60; index++) {
            let minute;
            if (index < 10) {
                minute = '0' + index.toString();
            } else {
                minute = index;
            }
            minutes.push(minute.toString());
        }

        return minutes;
    }

    updateDateRange() {
        if (typeof this.dateRange === 'string' && this.startDate) {
            this.visualStartDate = this.startDate;
            this.$emit('input', this.startDate);
        } else if (typeof this.dateRange !== 'string' && this.startDate && this.endDate) {
            if (this.dateRange.length === 2) {
                let isTameRangeCorrect = true;
                if (this.dateRange[0] === this.dateRange[1]) {
                    if (parseInt(this.timeRange[0].hour) > parseInt(this.timeRange[1].hour)) {
                        isTameRangeCorrect = false;
                    } else if (parseInt(this.timeRange[0].hour) === parseInt(this.timeRange[1].hour) && parseInt(this.timeRange[0].minute) >= parseInt(this.timeRange[1].minute)) {
                        isTameRangeCorrect = false;
                    }
                }
                if (isTameRangeCorrect) {
                    this.message = '';
                } else {
                    this.message = this.invalidTimeRangeText || 'Invalid Time Range';
                    this.tab = 1;

                    return;
                }

                this.visualStartDate = this.startDate;
                this.visualEndDate = this.endDate;
                this.$emit('input', {
                    startDate: this.startDate,
                    endDate: this.endDate
                });
            } else {
                this.dateRange = [this.visualStartDate.split(' ')[0], this.visualEndDate.split(' ')[0]];
            }
        }
        this.menu = false;
    }

    setInitialDate() {
        if (typeof this.initialDate === 'string') {
            this.dateRange = this.initialDate.split(' ')[0];
            this.startDate = this.initialDate;
            if (this.initialDate.split(' ').length === 2) {
                this.timeRange = [
                    {
                        hour: parseInt(this.initialDate.split(' ')[1].split(':')[0]).toString(),
                        minute: this.initialDate.split(' ')[1].split(':')[1]
                    }
                ];
            }
        } else if (typeof this.initialDate === 'object') {
            this.dateRange = [this.initialDate[0].split(' ')[0], this.initialDate[1].split(' ')[0]];
            this.startDate = this.initialDate[0];
            this.endDate = this.initialDate[1];
            if (this.initialDate[0].split(' ').length === 2 && this.initialDate[1].split(' ').length === 2) {
                this.timeRange = [
                    {
                        hour: parseInt(this.initialDate[0].split(' ')[1].split(':')[0]).toString(),
                        minute: this.initialDate[0].split(' ')[1].split(':')[1]
                    },
                    {
                        hour: parseInt(this.initialDate[1].split(' ')[1].split(':')[0]).toString(),
                        minute: this.initialDate[1].split(' ')[1].split(':')[1]
                    }
                ];
            }
        }
        this.updateDateRange();
    }

    clear() {
        this.menu = false;
        this.visualStartDate = '';
        this.visualEndDate = '';
        this.startDate = '';
        this.endDate = '';
        this.timeRange = [
            {
                hour: '0',
                minute: '00'
            },
            {
                hour: '23',
                minute: '59'
            }
        ];

        if (this.hasRangeSelection) {
            this.dateRange = [];
            this.$emit('input', {
                startDate: null,
                endDate: null
            });
        } else {
            this.dateRange = '';
            this.$emit('input', '');
        }
    }

    @Watch('initialDate', {deep: true})
    initialHandler() {
        this.setInitialDate();
    }

    @Watch('timeRange', {deep: true})
    timeRangeHandler() {
        if (this.menu) {
            this.startDate = typeof this.dateRange === 'string' ? this.dateRange : this.dateRange[0];
            if (this.hasTimeSelection && this.dateRange[0]) {
                this.startDate += ' ' + this.timeRange[0].hour + ':' + this.timeRange[0].minute;
            }
            if (this.hasRangeSelection && this.dateRange.length === 2) {
                this.endDate = typeof this.dateRange === 'string' ? '' : this.dateRange[1];
                if (this.hasTimeSelection) {
                    this.endDate += ' ' + this.timeRange[1].hour + ':' + this.timeRange[1].minute;
                }
            }
        }
    }

    @Watch('dateRange', {deep: true})
    dateRangeHandler(value: any, oldValue: any) {
        if (this.menu && value && JSON.stringify(value) !== JSON.stringify(oldValue)) {
            if (value.length === 1) {
                this.$emit('updateAllowedDateRange', value[0]);
            }
            if (typeof value !== 'string' && value.length === 2) {
                const startYear = parseInt(value[0].split('-')[0]);
                const endYear = parseInt(value[1].split('-')[0]);
                const startMonth = parseInt(value[0].split('-')[1]);
                const endMonth = parseInt(value[1].split('-')[1]);
                const startDay = parseInt(value[0].split('-')[2]);
                const endDay = parseInt(value[1].split('-')[2]);
                if (startYear > endYear) {
                    this.dateRange.reverse();
                } else if (startYear === endYear && startMonth > endMonth) {
                    this.dateRange.reverse();
                } else if (startYear === endYear && startMonth === endMonth && startDay > endDay) {
                    this.dateRange.reverse();
                }
            }
            this.startDate = typeof value === 'string' ? this.dateRange : (this.dateRange[0] || '');
            if (this.hasTimeSelection && value[0]) {
                this.startDate += ' ' + this.timeRange[0].hour + ':' + this.timeRange[0].minute;
            }
            if (this.hasRangeSelection && value.length === 2) {
                this.endDate = typeof value === 'string' ? '' : (this.dateRange[1] || '');
                if (this.hasTimeSelection) {
                    this.endDate += ' ' + this.timeRange[1].hour + ':' + this.timeRange[1].minute;
                }
            }
        }
    }

    @Watch('menu')
    menuHandler() {
        this.tab = 0;
    }
}
