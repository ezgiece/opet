<template>
  <!-- dialog component. gets dialogType prop as dialogConfirm type -->
  <!-- usage -->
  <!-- <DialogBox :showDialog="showDialog" :description="description" :id="id" :dialogType="dialogType"></DialogBox> -->
  <v-dialog v-model="showDialog" max-width="450" persistent>
    <v-card>
      <v-card-text v-text="description" />
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="$parent.showDialog = false">
          {{ $t("appComponents.cancel") }}
        </v-btn>
        <v-btn color="primary" text @click="submit(id, dialogType)">
          {{ $t("appComponents.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    description: {
      type: String,
      default: () => "",
    },
    showDialog: {
      type: Boolean,
      default: () => false,
    },
    dialogType: {
      type: String,
      default: () => "",
    },
    id: {
      type: String,
      default: () => "",
    },
  },
})
export default class DialogBox extends Vue {
  submit(id, dialogType) {
    if (dialogType === "delete") {
      //@ts-ignore
      this.$parent.deleteItem(id);
    }
  }
}
</script>

