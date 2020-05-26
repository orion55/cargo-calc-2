import _ from 'lodash';

// простой расчет цены услуги
const pricePlus = (obj, durability) => {
  let curPrice = 0;
  if (!_.isEmpty(obj)) {
    curPrice += obj.min_price;
    if (durability > obj.min_time) {
      curPrice += obj.additional_price * (durability - obj.min_time);
    }
  }
  return curPrice;
};

// расчёт цены пригорода или Самары
const priceSuburb = (options) => {
  const {
    priceData, carId, addressFromId, addressToId, durabilityId,
  } = options;
  let cur = {};
  if (carId >= 0 && carId <= 2) {
    cur = _.find(priceData, {
      car_id: carId,
      address_from: addressFromId,
      address_to: addressToId,
    });
  } else if (carId >= 3 && carId <= 6) {
    cur = _.find(priceData, { car_id: carId });
  }
  return pricePlus(cur, durabilityId);
};

// расчёт междугородней цены
const priceInterCity = (options) => {
  const { priceData, carId, address } = options;
  let cur = {};
  if (carId === 2 || carId === 3) {
    cur = _.find(priceData, {
      car_id: carId,
      address_to: address,
    });
    if (!_.isEmpty(cur)) {
      return cur.price;
    }
  }
  return 0;
};

// добавляем анимацию к объекту
const animateObj = (obj, className) => {
  obj.classList.add(className);

  setTimeout(() => {
    obj.classList.remove(className);
  }, 1000);
};

export {
  pricePlus, priceSuburb, priceInterCity, animateObj,
};
