<template>
  <!-- stepper inside data table component -->
  <!-- add show-select table attribute to select rows with checkboxes -->
  <!-- usage -->
  <!--<StepperDataTable :headers="headersAttribute" :list="assetTypeForm.selectedAttributes" :loading="loading" @removeItem="removeSelectedAttribute"></StepperDataTable> -->
  <v-data-table
    :headers="headers"
    :items="list"
    :loading="loading"
    item-key="name"
  >
    <template v-slot:[`item.Required`]="{ item }">
      <v-simple-checkbox v-model="item.Required" :disabled="readonly"></v-simple-checkbox>
    </template>
    <template v-slot:[`item.id`]="{ item }">
      <v-tooltip v-if="!readonly" bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            small
            dark
            text
            v-on="on"
            @click="removeSelectedItem(item)"
          >
            <v-icon small>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("appComponents.delete") }}</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
})
export default class StepperDataTable extends Vue {
  removeSelectedItem(item) {
    this.$emit('removeItem', item);
  }
}
</script>
