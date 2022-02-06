<template>
  <!-- overlay with data table component -->
  <!-- add show-select table attribute to select rows with checkboxes -->
  <!-- usage -->
  <!-- <OverlayDataTable :headers="headersOverlayAttribute" :list="overlayAttributes" :preSelectedItems="assetTypeForm.selectedAttributes" :loading="loading" @addList="addAttributeFromOverlay" ref="attributeOverlay"></OverlayDataTable> -->
  <v-overlay :value="visible">
    <v-card color="grey darken-3">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-btn color="indigo darken-4" @click="visible = false">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>
          <h4>{{ $t("appComponents.selectFromList") }}</h4>
          <v-data-table
            :search="search"
            :headers="headers"
            :items="list"
            :loading="loading"
            item-key="id"
            :items-per-page="10"
            v-model="selectedItems"
            show-select
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
              </v-toolbar>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-btn
              dark
              color="primary"
              @click="importSelectedItems()"
            >
              {{ $t("appComponents.addList") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { Watch } from 'vue-property-decorator';
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    headers: {
      type: Array,
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    preSelectedItems: {
      type: Array,
      default: () => [],
    }
  },
})
export default class OverlayDataTable extends Vue {

  selectedItems: any = [];
  visible: boolean = false;

  constructor() {
    super();
  }
  
  displayOverlay() {
    this.visible = true;
  }

  importSelectedItems() {
    this.$emit('addList', this.selectedItems);
    this.selectedItems = [];
    this.visible = false;
  }

  @Watch('preSelectedItems')
  setPreSelectedItems() {
    this.selectedItems = this.$props.preSelectedItems;
  }

  data() {
    return {
      search: "",
    };
  }
}
</script>
