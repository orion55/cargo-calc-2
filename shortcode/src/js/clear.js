import _ from 'lodash';
import { DateTime } from 'luxon';

function clear(self) {
  self.loaders.selected = {
    id: 0,
    label: '-',
  };
  self.durability.selected = {
    id: 1,
    label: '2 часа',
    $isDisabled: false,
  };
  self.address_from.selected = {
    id: 1,
    name: 'Центральный р-н',
  };
  self.address_from.street = '';
  self.address_from.house = '';
  self.address_from.entrance = '';
  self.address_to.selected = {
    id: 1,
    name: 'Центральный р-н',
  };
  self.address_to.street = '';
  self.address_to.house = '';
  self.address_to.entrance = '';
  if (!(_.isEmpty(self.car.options))) {
    self.car.selected = self.car.options[2];
  }
  self.calendar.datetime = DateTime.local().toISO();
  self.note.visibility = false;
  self.note.text = '';
  self.contact.name = '';
  self.contact.phone = '';
  self.card.serial = '';
  self.discount = 0;
  self.intercityFlag = false;
  _.forEach(self.car.options, (item) => {
    item.$isDisabled = false;
  });
}

export default clear;
