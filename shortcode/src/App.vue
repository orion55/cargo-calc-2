<template src="./app.html">
</template>

<script>
import Multiselect from 'vue-multiselect';
import _ from 'lodash';
import { DateTime } from 'luxon';
// import Inputmask from 'inputmask';
import Datetime from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import VeeValidate from 'vee-validate';
import axios from 'axios';
import { TweenLite } from 'gsap';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueSweetalert2 from 'vue-sweetalert2';
import {
  pricePlus, priceSuburb, priceInterCity, animateObj,
} from './js/util';
import init from './js/init';
import { fillDestinations } from './js/fill';
import durability from './js/durability';
import information from './js/info';

const Qs = require('qs');

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
      // текущие адреса
      const addressFromId = this.address_from.selected.id;
      const addressToId = this.address_to.selected.id;

      // текущий автомобиль
      const carId = this.car.selected.id;

      // длительность заказа
      const durabilityId = this.durability.selected.id;

      let currentPrice = 0;

      if (!_.isEmpty(this.info.data)) {
        // коллекция цен
        const priceData = this.info.data.price;

        this.changeBtn(true);

        const options = {
          priceData,
          carId,
          addressFromId,
          addressToId,
          durabilityId,
        };

        switch (true) {
          case addressFromId === 999:
            switch (true) {
              case addressToId === 999:
                currentPrice += priceSuburb(options);
                break;
              case addressToId === 998:
                currentPrice += priceSuburb(options);
                break;
              case addressToId < 100:
                currentPrice += priceSuburb(options);
                break;
              case addressToId >= 100 && addressToId < 900:
                currentPrice += priceInterCity({
                  priceData,
                  carId,
                  address: addressToId,
                });
                break;
              default:
                console.log('default999');
            }
            break;
          case addressFromId === 998:
            switch (true) {
              case addressToId === 999:
                currentPrice += priceSuburb(options);
                break;
              case addressToId === 998:
                currentPrice += priceSuburb(options);
                break;
              case addressToId < 100:
                currentPrice += priceSuburb(options);
                break;
              case addressToId >= 100 && addressToId < 900:
                currentPrice += priceInterCity({
                  priceData,
                  carId,
                  address: addressToId,
                });
                break;
              default:
                console.log('default998');
            }
            break;
          case addressFromId < 100:
            switch (true) {
              case addressToId === 999:
                currentPrice += priceSuburb(options);
                break;
              case addressToId === 998:
                currentPrice += priceSuburb(options);
                break;
              case addressToId < 100:
                currentPrice += priceSuburb(options);
                break;
              case addressToId >= 100 && addressToId < 900:
                currentPrice += priceInterCity({
                  priceData,
                  carId,
                  address: addressToId,
                });
                break;
              default:
                console.log('default<100');
            }
            break;
          case addressFromId >= 100 && addressFromId < 900:
            switch (true) {
              case addressToId === 999:
                currentPrice += priceInterCity({
                  priceData,
                  carId,
                  address: addressFromId,
                });
                break;
              case addressToId === 998:
                currentPrice += priceInterCity({
                  priceData,
                  carId,
                  address: addressFromId,
                });
                break;
              case addressToId < 100:
                currentPrice += priceInterCity({
                  priceData,
                  carId,
                  address: addressFromId,
                });
                break;
              case addressToId >= 100 && addressToId < 900:

                break;
              default:
                console.log('default>=100');
            }
            break;
          default:
            console.log('default');
        }

        if (currentPrice === 0) {
          this.changeBtn(false);
        }
      }
      return currentPrice;
    },
    price_normal() {
      return this.price_normal_common + this.price_movers;
    },
    price_movers() {
      // TODO Выполнить перерасчёт оплаты грузчиков
      let loadersPrice = 0;
      if (!_.isEmpty(this.info.data)) {
        const typeWorkId = this.typeWork;
        // коллекция цен грузчиков
        const priceLoader = this.info.data.price_loader;
        // грузчики
        const loadersId = +this.loaders.selected.id;
        const cargoTimeId = this.cargo_time.selected.id;

        if (loadersId !== 0) {
          const current = _.find(priceLoader, { type_work_id: typeWorkId });
          if (!_.isEmpty(current)) {
            loadersPrice = current.min_price * loadersId;
            const delta = cargoTimeId - current.min_time;
            if (delta > 0) {
              loadersPrice += current.additional_price * delta * loadersId;
            }
          }
        }
      }
      return loadersPrice;
    },
    typeWork() {
      // возращает тип работы для грузчиков: город, пригород, такелаж
      let typeWorkId = 0;
      const addressFromId = this.address_from.selected.id;
      const addressToId = this.address_to.selected.id;

      /* if (this.riggingFlag) {
                            typeWorkId = 2;
                          } else */
      if ((addressFromId >= 10 && addressFromId < 100) || (addressToId >= 10 && addressToId < 100)) {
        // если адреса из пригорода, но не такелаж, то грузчики - пригород
        typeWorkId = 1;
      }
      return typeWorkId;
    },
    economy() {
      return Math.round(this.price_normal * this.discount / 100);
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
      Vue.swal({
        type: 'info',
        title: this.car.selected.name,
        html: `${'<div class="calc__modal">'
                        + '<div class="calc__modal-desc">'}${this.car.selected.desc}</div>`
                        + '<div class="calc__modal-charater">'
                        + '<div class="calc__modal-text">Габаритные размеры</div>'
                        + `<div class="calc__modal-info">${this.car.selected.size}</div>`
                        + '<div class="calc__modal-text">Грузоподъемность</div>'
                        + `<div class="calc__modal-info">до ${this.car.selected.carrying}</div>`
                        + '</div></div>',
        confirmButtonColor: '#90B630',
      });
    },
    validateContact() {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            this.cargo_form.isCollapse = false;
            return;
          }

          const { btnContinue } = this.$refs;
          animateObj(btnContinue, 'hvr-buzz-out');
        });
    },
    validateCard() {
      let numberCard = this.card.serial;
      numberCard = parseInt(numberCard, 10);
      const { serial } = this.card_data;

      const result = serial.indexOf(numberCard);

      if (result !== -1) {
        animateObj(this.$refs.card, 'is-success');
        this.discount = this.card_data.discount;
      } else {
        this.discount = 0;
        animateObj(this.$refs.card, 'is-danger');
        animateObj(this.$refs.btnCheck, 'hvr-buzz-out');
      }
    },
    clearData() {
      this.loaders.selected = {
        id: 0,
        label: 'Нет',
      };
      /* this.cargo_time.selected = {
        id: 0,
        label: 'Нет',
        $isDisabled: false,
      }; */
      this.durability.selected = {
        id: 1,
        label: '2 часа',
        $isDisabled: false,
      };
      this.address_from.selected = {
        id: 1,
        name: 'Центральный р-н',
      };
      this.address_from.street = '';
      this.address_from.house = '';
      this.address_from.entrance = '';
      this.address_to.selected = {
        id: 1,
        name: 'Центральный р-н',
      };
      this.address_to.street = '';
      this.address_to.house = '';
      this.address_to.entrance = '';
      if (!(_.isEmpty(this.car.options))) {
        this.car.selected = this.car.options[0];
      }
      this.calendar.datetime = DateTime.local().toISO();
      this.note.visibility = false;
      this.note.text = '';
      this.contact.name = '';
      this.contact.phone = '';
      this.card.serial = '';
      this.discount = 0;
      this.intercityFlag = false;
      // this.riggingFlag = false;
      _.forEach(this.car.options, (item) => {
        item.$isDisabled = false;
      });
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
      const data = {
        action: 'cargo_add',
        nonce: this.wp_data.nonce,
        loaders: this.loaders.selected.label,
        // cargo_time: this.cargo_time.selected.label,
        // time_delivery: this.time_delivery.selected.name,
        durability: this.durability.selected.label,
        address_from: this.address_from.selected.name,
        address_from_street: this.address_from.street,
        address_from_house: this.address_from.house,
        address_from_entrance: this.address_from.entrance,
        address_to: this.address_to.selected.name,
        address_to_street: this.address_to.street,
        address_to_house: this.address_to.house,
        address_to_entrance: this.address_to.entrance,
        car: this.car.selected.name,
        calendar: this.calendar.datetime,
        note: this.note.text,
        contact_name: this.contact.name,
        contact_phone: this.contact.phone,
        card_serial: this.card.serial,
        price_normal: this.price_normal,
        economy: this.economy,
        discount: this.discount,
        price_result: this.price_result,
        // rigging: this.riggingFlag ? 'yes' : 'no',
      };
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            if (typeof window.yaCounter48348167 !== 'undefined') {
              window.yaCounter48348167.reachGoal('checkout');
            }
            axios.post(this.wp_data.url_ajax, Qs.stringify(data))
              .then((response) => {
                const answer = response.data;
                if (answer.success) {
                  this.objAlertResult.type = 'success';
                  this.objAlertResult.title = answer.data;
                } else {
                  this.objAlertResult.type = 'error';
                  this.objAlertResult.title = 'Ошибка';
                  this.objAlertResult.html = '';
                  answer.data.forEach((element) => {
                    this.objAlertResult.html += `${element}<br />`;
                  });
                }
                Vue.swal(this.objAlertResult);
              })
              .catch(() => {
                Vue.swal({
                  type: 'error',
                  title: 'Ошибка',
                  html: 'Ошибка сервера',
                  confirmButtonColor: '#90B630',
                });
              });
          } else {
            const { btnCheckout } = this.$refs;
            animateObj(btnCheckout, 'hvr-buzz-out');
            _.delay(() => {
              if (window.innerWidth <= 768) {
                this.goto('name_phone');
              }
            }, 1000);
          }
        });
    },
    goto(refName) {
      const element = this.$refs[refName];
      const top = element.offsetTop;
      window.scrollTo(0, top);
    },
    changeBtn(flag) {
      if (flag) {
        this.buttonCheckout.title = 'Оформить заказ';
        this.buttonCheckout.funct = this.checkout;
      } else {
        this.buttonCheckout.title = 'Оставить заявку';
        this.buttonCheckout.funct = this.callManager;
        const { btnCheckout } = this.$refs;
        animateObj(btnCheckout, 'hvr-buzz-out');
      }
    },
    callManager() {
      Vue.swal({
        type: 'info',
        title: '',
        html: 'К сожалению, выбранного направления пока нет, но мы постоянно расширяем список наших маршрутов.<br>'
                        + '<br>Позвоните нашему менеджеру по телефонам<br><a href="tel:+78482249060">+7 (8482) 24-90-60</a> <a href="tel:+78003506720">+7 800 350-67-20</a> '
                        + '<br>и узнайте возможно оно уже появилось.',
        confirmButtonColor: '#90B630',
      });
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
