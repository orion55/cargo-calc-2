import { DateTime } from 'luxon';

function demo(self) {
  self.loaders.selected = {
    id: 1,
    label: '1',
  };
  self.durability.selected = {
    id: 1,
    label: '2 часа',
    $isDisabled: false,
  };
  self.address_from.selected = { id: 1, name: 'Центральный р-н' };
  // self.address_from.selected = { id: 10, name: 'Ягодное' };
  self.address_from.street = 'Республики';
  self.address_from.house = '1';
  self.address_from.entrance = 'а';
  self.address_to.selected = { id: 1, name: 'Центральный р-н' };
  self.address_to.street = 'Республики';
  self.address_to.house = '2';
  self.address_to.entrance = 'б';
  self.car.selected = self.car.options[2];
  self.calendar.datetime = DateTime.local().toISO();
  self.note.visibility = false;
  self.note.text = 'Срочно, быстро, дешево!';
  self.contact.name = 'Милый Друг';
  self.contact.phone = '+7 (111) 111 11 11';
  self.card.serial = '0000000048';
  self.discount = 5;
  self.cargo_form.isCollapse = false;
  self.intercityFlag = false;
}

export default demo;
