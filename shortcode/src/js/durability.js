import _ from 'lodash';

const durability = (self) => {
  // блокировка пунктов меню "длительность заказа"
  // блокируем пункты выпадающего списка в зависимости от типа машины, времени подачи и адреса подачи
  const data = [];

  let i = 0;
  ['2 часа', '3 часа', '4 часа', '5 часов', '6 часов', '7 часов', '8 часов'].forEach((elem) => {
    data.push({ id: i, label: elem, $isDisabled: false });
    i += 1;
  });

  if (!_.isEmpty(self.info.data)) {
    const carId = self.car.selected.id;
    const priceData = self.info.data.price;

    let current = {};
    if (carId >= 0 && carId <= 2) {
      current = _.find(priceData, {
        carId,
        address_from: self.address_from.selected.id,
        address_to: self.address_to.selected.id,
      });
    } else if (carId >= 3 && carId <= 6) {
      current = _.find(priceData, { carId });
    }

    if (!_.isEmpty(current) && 'min_time' in current) {
      const minTime = +current.min_time - 1;
      if (minTime > 0) {
        const part = _.filter(data, (item) => item.id <= minTime);
        _.forEach(part, (item) => {
          item.$isDisabled = true;
        });
      }
      self.durability.selected = _.find(data, ['$isDisabled', false]);
    }
  }
  return data;
};

export default durability;
