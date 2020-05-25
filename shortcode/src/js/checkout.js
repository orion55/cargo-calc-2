import axios from 'axios';
import _ from 'lodash';
import { animateObj } from './util';

const Qs = require('qs');

function checkout(self) {
  const data = {
    action: 'cargo_add',
    nonce: self.wp_data.nonce,
    loaders: self.loaders.selected.label,
    durability: self.durability.selected.label,
    address_from: self.address_from.selected.name,
    address_from_street: self.address_from.street,
    address_from_house: self.address_from.house,
    address_from_entrance: self.address_from.entrance,
    address_to: self.address_to.selected.name,
    address_to_street: self.address_to.street,
    address_to_house: self.address_to.house,
    address_to_entrance: self.address_to.entrance,
    car: self.car.selected.name,
    calendar: self.calendar.datetime,
    note: self.note.text,
    contact_name: self.contact.name,
    contact_phone: self.contact.phone,
    card_serial: self.card.serial,
    price_normal: self.price_normal,
    economy: self.economy,
    discount: self.discount,
    price_result: self.price_result,
  };
  self.$validator.validateAll()
    .then((result) => {
      if (result) {
        if (typeof window.yaCounter48348167 !== 'undefined') {
          window.yaCounter48348167.reachGoal('checkout');
        }
        axios.post(self.wp_data.url_ajax, Qs.stringify(data))
          .then((response) => {
            const answer = response.data;
            if (answer.success) {
              self.objAlertResult.type = 'success';
              self.objAlertResult.title = answer.data;
            } else {
              self.objAlertResult.type = 'error';
              self.objAlertResult.title = 'Ошибка';
              self.objAlertResult.html = '';
              answer.data.forEach((element) => {
                self.objAlertResult.html += `${element}<br />`;
              });
            }
            Vue.swal(self.objAlertResult);
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
        const { btnCheckout } = self.$refs;
        animateObj(btnCheckout, 'hvr-buzz-out');
        _.delay(() => {
          if (window.innerWidth <= 768) {
            self.goto('name_phone');
          }
        }, 1000);
      }
    });
}

function changeBtn(self, flag) {
  if (flag) {
    self.buttonCheckout.title = 'Оформить заказ';
    self.buttonCheckout.funct = self.checkout;
  } else {
    self.buttonCheckout.title = 'Оставить заявку';
    self.buttonCheckout.funct = self.callManager;
    const { btnCheckout } = self.$refs;
    animateObj(btnCheckout, 'hvr-buzz-out');
  }
}

export { checkout, changeBtn };
