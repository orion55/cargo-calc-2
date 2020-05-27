import _ from 'lodash';
import { changeBtn } from './checkout';

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

const priceCalc = (self) => {
  let priceNormal = 0;

  // текущие адреса
  const addressFromId = self.address_from.selected.id;
  const addressToId = self.address_to.selected.id;

  // текущий автомобиль
  const carId = self.car.selected.id;

  // длительность заказа
  const durabilityId = self.durability.selected.id;

  if (!_.isEmpty(self.info.data)) {
    // коллекция цен
    const priceData = self.info.data.price;

    let currentPrice = 0;
    let current = {};
    let current1 = {};

    changeBtn(self, true);

    // debugger;
    // "тяжелые" автомобили не зависят от срочности, но это не междугородние рейсы
    /* if (carId >= 3 && carId <= 5) {
      if (addressToId < 100 && addressFromId < 100) {
        current = _.find(priceData, { car_id: carId });
        currentPrice += pricePlus(current, durabilityId);
      }
    } else */
    if (addressFromId < 10) {
      // расчет цены между районов внутри города
      if (addressToId < 10) {
        current = _.find(priceData, {
          car_id: carId,
          address_from: addressFromId,
          address_to: addressToId,
        });
      } else if (addressToId < 100) {
        // расчет город - пригород
        current = _.find(priceData, {
          car_id: carId,
          address_to: addressToId,
        });
      }
      currentPrice += pricePlus(current, durabilityId);
    } else if (addressFromId < 100) {
      // расчет пригород - город
      if (addressToId < 10) {
        current = _.find(priceData, {
          car_id: carId,
          address_to: addressFromId,
        });
        currentPrice += pricePlus(current, durabilityId);
      } else if (addressToId < 100) {
        // расчет пригород - пригород
        current = _.find(priceData, {
          car_id: carId,
          address_to: addressFromId,
        });
        current1 = _.find(priceData, {
          car_id: carId,
          address_to: addressToId,
        });

        if (!_.isEmpty(current) && !_.isEmpty(current1)) {
          currentPrice += current.min_price;
          currentPrice += current1.min_price;

          if (durabilityId > current.min_time) {
            currentPrice += current.additional_price * (durabilityId - current.min_time);
          }
        }
      }
    }
    if (addressFromId >= 100 && addressToId >= 100) {
      // расчет межгород
      if (addressFromId === 999 && addressToId === 999) {
        changeBtn(self, false);
      } else if (addressFromId === 999 || addressToId === 999) {
        const addressDest = addressFromId === 999 ? addressToId : addressFromId;

        current = _.find(priceData, {
          car_id: carId,
          address_to: addressDest,
        });
        currentPrice += current.price;
      } else {
        changeBtn(self, false);
      }
    }
    if (current === undefined) {
      currentPrice = 0;
      changeBtn(self, false);
    }
    priceNormal += currentPrice;
  }
  return priceNormal;
};

export default priceCalc;
