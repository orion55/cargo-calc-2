import axios from 'axios';
import _ from 'lodash';
import { DateTime } from 'luxon';
import Inputmask from 'inputmask';
import { fillDestinations, fillLoaders } from './fill';
import demo from './demodata';

const DEBUG = false;

const init = (self) => {
  fillLoaders(self);

  axios
    .all([axios.get(`${wp_data.plugin_dir_url}assets/json/price.json`),
      axios.get(`${wp_data.plugin_dir_url}assets/json/card.json`)])
    .then(axios.spread((response, cardResponse) => {
      self.info.data = response.data;

      // Заполняем список автомобилей
      _.forEach(self.info.data.metadata.car, (item) => {
        item.$isDisabled = false;
        self.car.options.push(item);
      });
      self.car.selected = self.car.options[2];

      // Заполняем пункты назначения
      fillDestinations(self);

      // устанавливаем время
      self.calendar.datetime = DateTime.local().toISO();

      // устанавливаем маску телефона
      const im = new Inputmask('+7 (999) 999 99 99');
      im.mask(self.$refs.phone);

      let arrSerial = cardResponse.data.serial;
      arrSerial = arrSerial.map((num) => parseInt(num, 10));
      arrSerial = _.uniq(arrSerial);
      arrSerial.sort((a, b) => a - b);

      self.card_data = {
        discount: parseInt(cardResponse.data.discount, 10),
        serial: arrSerial,
      };

      if (DEBUG) demo(self);

      if (self.wp_data.is_full === '1') {
        self.cargo_form.isCollapse = false;
      }
    }))
    .catch((error) => {
      _.delay(() => {
        self.loading = false;
      }, 500);
      console.log(`Error:${error}`);
      self.info.errored = true;
    })
    .finally(() => {
      self.info.loading = false;
      _.delay(() => {
        self.loading = false;
      }, 500);
    });
};

export default init;
