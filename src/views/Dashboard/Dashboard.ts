import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment';
import DatePicker from '@/components/DatePicker/DatePicker.vue';
import reportService from '@/services/report-service'
import { getThisMonthsDateRange, getTodaysDate, breakObject, floorTwoDigits } from '@/utils/methods'
import { FilterDto } from '@/models/filter/filter-dto';
import { StaticModelDTO } from '@/models/dashboard/static-model-dto';
import { Periods, Graphics } from '@/models/dashboard/options';
import { GChart } from 'vue-google-charts';
import { AxiosError } from 'axios'
@Component({
  components: {
    DatePicker,
    GChart
  }
})

export default class Dashboard extends Vue {

  menu = false;
  date = getTodaysDate();
  staticFields = StaticModelDTO.Create();
  font = '"Roboto", sans-serif !important;';
  fontColor = '#e3eaff';
  reportData = {
    rateData: [],
    countData: []
  }
  initialCdata = {
    chart: {}
  };

  initialData = {
    charts: [],
  };
  data = breakObject(this.initialData);

  chartOptions = {
    height: 450,
    seriesType: '',
    legend: { textStyle: { color: this.fontColor } },
    fontName: this.font,
    backgroundColor: {
      fill: 'transparent'
    },
    chartArea: {
      backgroundColor: {
        fill: 'transparent'
      }
    },
    isStacked: null,
    series: {},
    tooltip: {
      isHtml: true
    }
  }

  periodOptions = Periods;
  graphicOptions = Graphics;



  disabledField: Boolean = false;

  loading: Boolean = false;

  filter = FilterDto.Create();
  datePickerInitialDate = getThisMonthsDateRange();

  created() {
    this.filter.period = 1;
    this.filter.graphic = 'ComboChart';
    this.chartChange();
  }


  clear() {
    this.filter = FilterDto.Create();
    this.staticFields = StaticModelDTO.Create();
    this.disabledField = false;
    this.datePickerInitialDate = getThisMonthsDateRange();
    this.filter.period = 1;
    this.filter.graphic = 'ComboChart';
    this.data.charts = [];

  }
  updateDate(dateRange) {
    this.filter.startDate = dateRange.startDate ? moment(dateRange.startDate).utc().local().format('YYYY-MM-DD') : '';
    this.filter.endDate = dateRange.endDate ? moment(dateRange.endDate).utc().local().format('YYYY-MM-DD') : '';
  }
  datePickerOptions() {
    return {
      hasRangeSelection: true,
      hasTimeSelection: false,
      startTitle: this.$t('common.startDate'),
      endTitle: this.$t('common.endDate'),
      okTitle: this.$t('common.ok'),
      clearTitle: this.$t('common.clear'),
      locale: this.$i18n.locale
    };
  }



  async fetchData() {
    this.data.charts = [];
    this.loading = true;
    await reportService.GET_OVERVIEW_DATA(this.filter).then(result => {
      this.staticFields = result.Data;
      this.staticFields.Rate = floorTwoDigits(this.staticFields.Rate);

    }).catch(e => {
      this.loading = false;
    });


    await reportService.GET_COUNT_DATA(this.filter).then(result => {
      this.reportData.countData = result.Data;
    }).catch(e => {
      let error = (e as AxiosError)?.response.data.Messages[0];
      let message = `${this.$t(`errors.${error}`)} \n`

      this.$toast(message, {
        x: 'left',
        y: 'bottom',
        color: 'error',
        showClose: true
      });
      this.loading = false;
    });

    this.drawCharts();
  }

  formatDate(value) {
    return moment.utc(value).local().format('YYYY-MM-DD');
  }

  chartChange() {
    switch (this.filter.graphic) {
      case 'ComboChart':
        this.chartOptions.seriesType = 'bars';
        this.chartOptions.isStacked = null;
        this.chartOptions.series = { 0: { type: 'line' } };
        break;
      case 'ColumnChart':
        this.chartOptions.seriesType = 'bars';
        this.chartOptions.isStacked = null;
        this.chartOptions.series = {};
        break;
      case 'LineChart':
        this.chartOptions.seriesType = '';
        this.chartOptions.isStacked = null;
        this.chartOptions.series = {};
        break;
        case 'AreaChart':
          this.chartOptions.seriesType = '';
          this.chartOptions.isStacked = false;
          this.chartOptions.series = {};
          break;
        case 'SteppedAreaChart':
          this.chartOptions.seriesType = '';
          this.chartOptions.isStacked ='percent';
          this.chartOptions.series = {};
          break;
    }
  }

  drawCharts() {

    var comboChart = {
      countBarChart: {
        data: [],
        type: this.graphicOptions.find(a => a.value == this.filter.graphic).value,
        options: {
          ...this.chartOptions,
          vAxis: {
            title: this.$t('dashboard.countOfVehicles').toString(),
            titleTextStyle: { color: this.fontColor },
            textStyle: { color: this.fontColor },
            color: this.fontColor
          },
          hAxis: {
            title: this.periodOptions.find(a => a.value == this.filter.period).text,
            titleTextStyle: { color: this.fontColor },
            textStyle: { fontSize: 9, color: this.fontColor }
          },

        }
      }
    };

    comboChart.countBarChart.data.push([this.$t('dashboard.Date'), this.$t('dashboard.numberOfVehiclesEnteringTheStation'), { role: 'tooltip', p: { html: true } }, this.$t('dashboard.Total')]);
    this.reportData.countData.forEach(element => {
      debugger
      let percentage = element.Count / element.Total * 100;
      let tooltip = `<div class='pa-3' style='color:black;font-family:${this.font}'<p><b> ${this.filter.period!==1?this.formatDate(element.Date):element.Date }</b></p>`;
      tooltip += `<p>${this.$t('dashboard.rate')}:<b> ${floorTwoDigits(percentage)}</b></p>`;
      tooltip += `<p>${this.$t('dashboard.numberOfVehiclesEnteringTheStation')}:<b> ${element.Count}</b></p></div>`;


      if (this.filter.period !== 1) {
        comboChart.countBarChart.data.push([this.formatDate(element.Date), element.Count, tooltip, element.Total]);
      } else {
        comboChart.countBarChart.data.push([element.Date, element.Count, tooltip, element.Total]);
      }
    });
    this.data.charts.push(comboChart);
    this.loading = false;
  }

}