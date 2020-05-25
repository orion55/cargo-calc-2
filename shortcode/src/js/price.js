import _ from 'lodash';
import { priceInterCity, priceSuburb } from './util';

function priceCalc(self) {
  // текущие адреса
  const addressFromId = self.address_from.selected.id;
  const addressToId = self.address_to.selected.id;

  // текущий автомобиль
  const carId = self.car.selected.id;

  // длительность заказа
  const durabilityId = self.durability.selected.id;

  let currentPrice = 0;

  if (!_.isEmpty(self.info.data)) {
    // коллекция цен
    const priceData = self.info.data.price;

    self.changeBtn(true);

    const options = {
      priceData,
      carId,
      addressFromId,
      addressToId,
      durabilityId,
    };

    switch (true) {
      case addressFromId === 999:
        switch (true) {
          case addressToId === 999:
            currentPrice += priceSuburb(options);
            break;
          case addressToId === 998:
            currentPrice += priceSuburb(options);
            break;
          case addressToId < 100:
            currentPrice += priceSuburb(options);
            break;
          case addressToId >= 100 && addressToId < 900:
            currentPrice += priceInterCity({
              priceData,
              carId,
              address: addressToId,
            });
            break;
          default:
            console.log('default999');
        }
        break;
      case addressFromId === 998:
        switch (true) {
          case addressToId === 999:
            currentPrice += priceSuburb(options);
            break;
          case addressToId === 998:
            currentPrice += priceSuburb(options);
            break;
          case addressToId < 100:
            currentPrice += priceSuburb(options);
            break;
          case addressToId >= 100 && addressToId < 900:
            currentPrice += priceInterCity({
              priceData,
              carId,
              address: addressToId,
            });
            break;
          default:
            console.log('default998');
        }
        break;
      case addressFromId < 100:
        switch (true) {
          case addressToId === 999:
            currentPrice += priceSuburb(options);
            break;
          case addressToId === 998:
            currentPrice += priceSuburb(options);
            break;
          case addressToId < 100:
            currentPrice += priceSuburb(options);
            break;
          case addressToId >= 100 && addressToId < 900:
            currentPrice += priceInterCity({
              priceData,
              carId,
              address: addressToId,
            });
            break;
          default:
            console.log('default<100');
        }
        break;
      case addressFromId >= 100 && addressFromId < 900:
        switch (true) {
          case addressToId === 999:
            currentPrice += priceInterCity({
              priceData,
              carId,
              address: addressFromId,
            });
            break;
          case addressToId === 998:
            currentPrice += priceInterCity({
              priceData,
              carId,
              address: addressFromId,
            });
            break;
          case addressToId < 100:
            currentPrice += priceInterCity({
              priceData,
              carId,
              address: addressFromId,
            });
            break;
          case addressToId >= 100 && addressToId < 900:

            break;
          default:
            console.log('default>=100');
        }
        break;
      default:
        console.log('default');
    }

    if (currentPrice === 0) {
      self.changeBtn(false);
    }
  }
  return currentPrice;
}

export default priceCalc;
