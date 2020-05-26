import _ from 'lodash';

const carOptions = (self) => {
  // Заполняем список автомобилей
  const data = [];

  const from10To100 = (item) => item.address_to >= 10 && item.address_to < 100;
  const moreThan100 = (item) => item.address_to >= 100;

  const disableItem = (priceData, filterFun) => _(priceData)
    .filter((item) => filterFun(item))
    .map((item) => item.car_id)
    .uniq()
    .value();

  if (!_.isEmpty(self.info.data)) {
    const priceData = self.info.data.price;
    const addressFrom = self.address_from.selected.id;
    const addressTo = self.address_to.selected.id;
    const addressAny = Math.max(addressFrom, addressTo);

    _.forEach(self.info.data.metadata.car, (item) => data.push({ ...item, $isDisabled: false }));

    let result = [];

    if (addressAny >= 10 && addressAny < 100) {
      result = disableItem(priceData, from10To100);
    } else if (addressAny >= 100) {
      result = disableItem(priceData, moreThan100);
    }

    if (!_.isEmpty(result)) {
      data.filter((item) => !result.includes(item.id)).forEach((item) => item.$isDisabled = true);
      if (addressAny >= 10 && addressAny < 100) {
        // На пригороде выберием газель 2т.
        self.car.selected = data[2];
      } else if (addressAny >= 100) {
        // На межгороде первую незаблокированную машину
        self.car.selected = _.find(data, ['$isDisabled', false]);
      }
    }
  }
  return data;
};

export default carOptions;
