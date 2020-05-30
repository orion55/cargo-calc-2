import _ from 'lodash';

const fillLoaders = (self) => {
  // Заполняем количество грузчиков
  let i = 0;
  ['-', 1, 2, 3, 4].forEach((elem) => {
    self.loaders.options.push({ id: i, label: elem.toString() });
    i += 1;
  });
  self.loaders.selected = self.loaders.options[0];
};

const fillDestinations = (self) => {
  // Заполняем пункты назначения
  // если не установлен флаг междугородние перевозки
  if (!self.intercityFlag) {
    self.address.options = [{
      place: 'г. Тольятти',
      area: [],
    }, {
      place: 'Пригород',
      area: [],
    }];

    let filterArray = _.filter(self.info.data.metadata.area, (item) => item.id < 10);
    _.forEach(filterArray, (item) => {
      self.address.options[0].area.push(item);
    });
    filterArray = _.filter(self.info.data.metadata.area, (item) => item.id >= 10 && item.id < 100);
    filterArray = _.sortBy(filterArray, [(item) => item.name]);
    _.forEach(filterArray, (item) => {
      self.address.options[1].area.push(item);
    });

    self.address_from.selected = {
      id: 0,
      name: 'Автозаводский р-н',
    };
    self.address_to.selected = {
      id: 0,
      name: 'Автозаводский р-н',
    };

    if (!(_.isEmpty(self.car.options))) {
      _.forEach(self.car.options, (item) => {
        item.$isDisabled = false;
      });
    }
  } else {
    self.address.options = [{
      place: 'Города',
      area: [],
    }];
    let filterArray = _.filter(self.info.data.metadata.area, (item) => item.id >= 100);
    filterArray = _.sortBy(filterArray, [(item) => item.name]);
    _.forEach(filterArray, (item) => {
      self.address.options[0].area.push(item);
    });

    self.address_from.selected = {
      id: 999,
      name: 'Тольятти',
    };
    self.address_to.selected = {
      id: 123,
      name: 'Москва',
    };

    _.forEach(self.car.options, (item) => {
      if (item.id !== 2 && item.id !== 3) {
        item.$isDisabled = true;
      }
    });
    self.car.selected = self.car.options[2];
  }
};

export {
  fillDestinations, fillLoaders,
};
