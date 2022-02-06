
<template>
  <!-- Password input component -->
  <!-- Usage -->
  <!-- <Password v-model="password" label="Password"></Password> -->
  <span>
    <v-text-field
      class="passwordInput"  
      :type="show ? 'text' : 'password'"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="show = !show"
      :label="label"
      outlined
      :value="value"
      :rules="rules"
      :error-messages="errorMessages">
      </v-text-field>

  </span>
</template>
<style>
.passwordInput{
    width:350px;
}
</style>


<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import i18n from "@/plugins/i18n";

@Component({
  props: {
    // Label that appers on the input area
    label: {
      type: String,
      default: i18n.t("login.password").toString(),
    },
    // v-model binding value
    value: {
      type: String,
      default: null,
    },

    rules: {
      type: Array,
      default: () => [],
    },
    errorMessages: {
      type: String || Array,
      default: "",
    },
  },
})
export default class Password extends Vue {
  data() {
    return {
      show: false,
    };
  }
}
</script>