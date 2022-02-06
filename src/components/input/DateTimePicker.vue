
<template>
  <!-- Date & time picker input component -->
  <!-- Usage -->
  <!-- <DateTimePicker v-model="startDate" label="Start Date"></DateTimePicker> -->
  <span>
    <v-text-field :label="label" outlined :value="getFormattedDate()" :rules="rules" :error-messages="errorMessages" readonly @click="clickRealPicker()"></v-text-field>
    <span class="invisibleDatetimePicker" ref='invisibleDatetimePicker'>
      <v-datetime-picker v-model="internalValue"></v-datetime-picker>
    </span>
  </span>
</template>

<style>
  .invisibleDatetimePicker {
    display: none;
  }
  .theme--dark.v-picker__body {
    background: inherit !important;
  }
  .theme--dark.v-time-picker-clock {
    background: #3A475A !important;
  }
   div.v-time-picker-clock__hand.accent, span.v-time-picker-clock__item.accent{
    background-color: #4788f4 !important;
    border-color: #4788f4!important;
  }
  
</style>

<script lang="ts">

import Component from 'vue-class-component';
import Vue from 'vue'
import { Watch } from 'vue-property-decorator';
import moment from 'moment';
import i18n from '@/plugins/i18n';

@Component({
  props: {
    // Label that appers on the input area
    label: {
      type: String,
      default: i18n.t('common.select').toString()
    },
    // v-model binding value
    value: {
      type: Date,
      default: null
    },
    // Formatting string for the date shown in the input component
    dateFormat: {
      type: String,
      default: "DD/MM/YYYY HH:mm:ss"
    },
    // Whether the visible date should be localized or not
    local: {
      type: Boolean,
      default: true
    },
    rules: {
      type: Array,
      default: () => []
    },
    errorMessages: {
      type: String || Array,
      default: ""
    }
  }
})
export default class DateTimePicker extends Vue {

  internalValue: any = this.$props.value;

  @Watch('internalValue') 
  internalValueChange() {
    this.$emit('input', this.internalValue);
  }

  clickRealPicker() {
    let realPicker: any = this.$refs['invisibleDatetimePicker'];
    // get to the innermost input component with a while loop, then click
    while(realPicker.children && realPicker.children[0]) {
      realPicker = realPicker.children[0]
    }
    realPicker.click();
  }

  getFormattedDate(): string {
    if(this.internalValue == undefined) return '';
    try {
      let tmpString = moment.utc(this.internalValue);
      if(this.$props.local) tmpString = tmpString.local();
      return tmpString.format(this.$props.dateFormat);
    }
    catch (error) {
      return '';
    }
  }
  
}

</script>