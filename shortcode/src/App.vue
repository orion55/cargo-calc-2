<template src="./app.html">
</template>

<script>
import Multiselect from 'vue-multiselect';
import _ from 'lodash';
import Datetime from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import VeeValidate from 'vee-validate';
import { TweenLite } from 'gsap';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueSweetalert2 from 'vue-sweetalert2';
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
    cargo_options() {
      // TODO Удалить "Время работы грузчиков"
      const data = [
        {
          id: 0,
          label: 'Нет',
          $isDisabled: false,
        },
        {
          id: 1,
          label: '1 час',
          $isDisabled: false,
        },
        {
          id: 2,
          label: '2 часа',
          $isDisabled: false,
        },
        {
          id: 3,
          label: '3 часа',
          $isDisabled: false,
        },
        {
          id: 4,
          label: '4 часа',
          $isDisabled: false,
        },
        {
          id: 5,
          label: '5 часов',
          $isDisabled: false,
        },
        {
          id: 6,
          label: '6 часов',
          $isDisabled: false,
        },
        {
          id: 7,
          label: '7 часов',
          $isDisabled: false,
        },
        {
          id: 8,
          label: '8 часов',
          $isDisabled: false,
        },
      ];
      if (!_.isEmpty(this.info.data)) {
        const current = _.find(this.info.data.price_loader, {
          type_work_id: this.typeWork,
        });
        if (!_.isEmpty(current) && 'min_time' in current) {
          const minTime = +current.min_time - 1;
          if (minTime > 0) {
            const part = _.filter(data, (item) => item.id <= minTime);
            _.forEach(part, (item) => {
              item.$isDisabled = true;
            });
          }
          // если уже установлен заблокированный элемент, меняем на первый за ним незаблокированный
          /* if (data[this.cargo_time.selected.id].$isDisabled) {
            this.cargo_time.selected = _.find(data, ['$isDisabled', false]);
          } */
        }
      }
      return data;
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
    isDisabledCargoTime() {
      // TODO Удалить отключение времени работы грузчиков
      if (typeof this.loaders.selected.id !== 'undefined') {
        if (this.loaders.selected.id === 0) {
          this.cargo_time.selected = {
            id: 0,
            label: 'Нет',
            $isDisabled: false,
          };
        }
        return this.loaders.selected.id === 0;
      }
      return null;
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
