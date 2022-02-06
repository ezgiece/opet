<template>
  <!-- generic overlay component -->
  <!-- usage -->
  <!-- <Overlay ref="myOverlay"> [Your html goes here] </Overlay> -->
  <!-- In order to activate the overlay, call the displayOverlay function using the ref -->
  <v-overlay :value="visible">
    <v-card color="grey darken-3">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-btn color="indigo darken-4" @click="buttonClick('cancel')">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>
          
          <slot></slot>
          
        </v-col>
      </v-row>
      <v-card-actions>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-btn dark color="primary" @click="buttonClick('apply')" :disabled="buttonDisabled">
              {{ btnText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import i18n from "@/plugins/i18n";
import { Watch } from "vue-property-decorator";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    buttonText: {
      type: String,
      default: '',
    },
    buttonDisabled: {
      type: Boolean,
      default: false
    }
  },
})
export default class Overlay extends Vue {
  visible: boolean = false;
  btnText: string = i18n.t("common.ok").toString();

  constructor() {
    super();
    if(this.$props.buttonText.length != 0) this.btnText = this.$props.buttonText;
  }

  @Watch('buttonText')
  buttonTextChange() {
    if(this.$props.buttonText.length != 0) this.btnText = this.$props.buttonText;
    else this.btnText = i18n.t("common.ok").toString();
  }
  
  displayOverlay() {
    this.visible = true;
  }

  buttonClick(buttonName: string) {
    this.visible = false;
    this.$emit(buttonName);
  }
}
</script>
