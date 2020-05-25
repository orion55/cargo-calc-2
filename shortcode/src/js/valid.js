import { animateObj } from './util';

function validateContact(self) {
  self.$validator.validateAll()
    .then((result) => {
      if (result) {
        self.cargo_form.isCollapse = false;
        return;
      }

      const { btnContinue } = self.$refs;
      animateObj(btnContinue, 'hvr-buzz-out');
    });
}


function validateCard(self) {
  let numberCard = self.card.serial;
  numberCard = parseInt(numberCard, 10);
  const { serial } = self.card_data;

  const result = serial.indexOf(numberCard);

  if (result !== -1) {
    animateObj(self.$refs.card, 'is-success');
    self.discount = self.card_data.discount;
  } else {
    self.discount = 0;
    animateObj(self.$refs.card, 'is-danger');
    animateObj(self.$refs.btnCheck, 'hvr-buzz-out');
  }
}

export { validateCard, validateContact };
