<template>
  <!-- data table component -->
  <!-- add show-select table attribute to select rows with checkboxes -->
  <!-- use a column with an empty title and a value of item id to add edit & delete buttons -->
  <!-- usage -->
  <!-- <DataTable :headers="headers" :list="list" :componentName="componentName" :loading="loading"></DataTable> -->
  <!-- Parent component needs to implement openDialog function for deletion dialog to work properly -->
  
  <v-data-table
    :headers="headers"
    :items="list"
    :loading="loading"
    :search="search"
    item-key="Id"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          append-icon="search"
          :label="$t('appComponents.search')"
          single-line
          hide-details
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <v-btn dark :to="'/' + componentName + '/Edit/-1'" color="primary">
          {{ $t("appComponents.addNew") }}
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:[`item.Required`]="{ item }">
      <v-radio-group v-model="item.Required">
        <v-radio
          :key="true"
          :value="true"
          disabled
        ></v-radio>
      </v-radio-group>
    </template>
    <template v-slot:[`item.Id`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            small
            dark
            text
            v-on="on"
            :to="{ name: componentName + 'Edit', params: { Id: item.Id } }"
          >
            <v-icon small>mdi-pencil-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("appComponents.edit") }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn small dark text v-on="on" @click="$parent.openDialog(item)">
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
    componentName: {
      type: String,
      default: () => "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
})
export default class DataTable extends Vue {
  data() {
    return {
      search: "",
    };
  }
}
</script>
