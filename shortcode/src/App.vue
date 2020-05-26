<template src="./app.html">
</template>

<script>
import Multiselect from 'vue-multiselect';
import Datetime from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import VeeValidate from 'vee-validate';
import { TweenLite } from 'gsap';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import init from './js/init';
import { fillDestinations } from './js/fill';
import durability from './js/durability';
import information from './js/info';
import { modal, callManager } from './js/modal';
import clear from './js/clear';
import { checkout, changeBtn } from './js/checkout';
import { validateCard, validateContact } from './js/valid';
import { priceMovers, typeWork } from './js/loaders';
import priceCalc from './js/price';
import carOptions from './js/car';

Vue.component('multiselect', Multiselect);
Vue.use(Datetime);
Vue.use(VeeValidate);
Vue.use(VueSweetalert2);

export default {
  name: 'app',
  components: {
    Multiselect,
  },
  data() {
    return information(this);
  },
  computed: {
    wp_data() {
      return window.wp_data;
    },
    durability_options() {
      return durability(this);
    },
    car_options() {
      return carOptions(this);
    },
    price_normal_common() {
      return priceCalc(this);
    },
    price_normal() {
      return this.price_normal_common + this.price_movers;
    },
    price_movers() {
      return priceMovers(this);
    },
    typeWork() {
      return typeWork(this);
    },
    economy() {
      return Math.round((this.price_normal * this.discount) / 100);
    },
    price_result() {
      return this.price_normal - this.economy;
    },
    animated_price_result() {
      return this.tweened_price_normal.toFixed(0);
    },
  },
  methods: {
    inverseShowNote() {
      this.note.visibility = !this.note.visibility;
    },
    openSimplert() {
      modal(this);
    },
    validateContact() {
      validateContact(this);
    },
    validateCard() {
      validateCard(this);
    },
    clearData() {
      clear(this);
    },
    closeForm() {
      this.cargo_form.isCollapse = !this.cargo_form.isCollapse;
    },
    onFocus() {
      if (this.cargo_form.isCollapse) {
        this.cargo_form.isCollapse = false;
      }
    },
    checkout() {
      checkout(this);
    },
    goto(refName) {
      const element = this.$refs[refName];
      const top = element.offsetTop;
      window.scrollTo(0, top);
    },
    changeBtn(flag) {
      changeBtn(this, flag);
    },
    callManager() {
      callManager();
    },
    fillDest() {
      fillDestinations(this);
    },
  },
  watch: {
    price_result(newValue) {
      TweenLite.to(this.$data, 1, { tweened_price_normal: newValue });
    },
  },
  mounted() {
    init(this);
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
    @import "./fonts/fonts";
    @import "./fonts/fontawesome";
    @import "./css/base/vars";
    @import "./css/base/smart-grid";
    @import "./css/base/misc";
    @import "./css/base/checkbox";
    @import "./css/base/preloader";
    @import "./css/modules/calc";
</style>
