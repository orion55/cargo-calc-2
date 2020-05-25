function modal(self) {
  Vue.swal({
    type: 'info',
    title: self.car.selected.name,
    html: `${'<div class="calc__modal">'
            + '<div class="calc__modal-desc">'}${self.car.selected.desc}</div>`
            + '<div class="calc__modal-charater">'
            + '<div class="calc__modal-text">Габаритные размеры</div>'
            + `<div class="calc__modal-info">${self.car.selected.size}</div>`
            + '<div class="calc__modal-text">Грузоподъемность</div>'
            + `<div class="calc__modal-info">до ${self.car.selected.carrying}</div>`
            + '</div></div>',
    confirmButtonColor: '#90B630',
  });
}

function callManager() {
  Vue.swal({
    type: 'info',
    title: '',
    html: 'К сожалению, выбранного направления пока нет, но мы постоянно расширяем список наших маршрутов.<br>'
        + '<br>Позвоните нашему менеджеру по телефонам<br><a href="tel:+78482249060">+7 (8482) 24-90-60</a> <a href="tel:+78003506720">+7 800 350-67-20</a> '
        + '<br>и узнайте возможно оно уже появилось.',
    confirmButtonColor: '#90B630',
  });
}

export { modal, callManager };
