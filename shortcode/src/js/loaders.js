import _ from 'lodash';

const typeWork = (self) => {
  // возращает тип работы для грузчиков: город, пригород

  // по умолчанию город
  let typeWorkId = 0;
  const addressFromId = self.address_from.selected.id;
  const addressToId = self.address_to.selected.id;

  // if ((addressFromId >= 10 && addressFromId < 100) || (addressToId >= 10 && addressToId < 100)) {
  if ((addressFromId >= 10) || (addressToId >= 10)) {
    // если адреса из пригорода или межгорода, то тип погрузки пригород
    typeWorkId = 1;
  }
  return typeWorkId;
};

const priceMovers = (self) => {
  let loadersPrice = 0;
  if (!_.isEmpty(self.info.data)) {
    const typeWorkId = typeWork(self);
    // коллекция цен грузчиков
    const priceLoader = self.info.data.price_loader;
    // грузчики
    const loadersId = self.loaders.selected.id * 1;
    const durabilityId = self.durability.selected.id;

    if (loadersId !== 0) {
      const current = _.find(priceLoader, { type_work_id: typeWorkId });
      if (!_.isEmpty(current)) {
        loadersPrice = current.min_price * loadersId;
        const delta = durabilityId + 1 - current.min_time;
        if (delta > 0) {
          loadersPrice += current.additional_price * delta * loadersId;
        }
      }
    }
  }
  return loadersPrice;
};

export { priceMovers, typeWork };
