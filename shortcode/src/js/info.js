const information = (self) => ({
  info: {
    data: null,
    loading: true,
    errored: false,
  },
  loaders: {
    selected: {},
    options: [],
  },
  cargo_time: {
    // TODO удалить неиспользуемую структуру данных
    selected: {
      id: 0,
      label: 'Нет',
      $isDisabled: false,
    },
    isDisabled: true,
  },
  durability: {
    selected: {
      id: 1,
      label: '2 часа',
      $isDisabled: false,
    },
  },
  address_from: {
    selected: {},
    street: '',
    house: '',
    entrance: '',
  },
  address_to: {
    selected: {},
    street: '',
    house: '',
    entrance: '',
  },
  address: {
    options: [],
  },
  car: {
    selected: {},
    options: [],
  },
  calendar: {
    datetime: null,
  },
  note: {
    visibility: false,
    text: '',
  },
  objAlertResult: {
    title: '',
    html: '',
    type: '',
    confirmButtonColor: '#90B630',
  },
  contact: {
    name: '',
    phone: '',
  },
  card: {
    serial: '',
  },
  formResult: false,
  discount: 0,
  card_data: null,
  tweened_price_normal: 0,
  cargo_form: {
    isCollapse: true,
    isDisable: false,
  },
  intercityFlag: false,
  loading: true,
  buttonCheckout: {
    title: 'Оформить заказ',
    funct: self.checkout,
  },
});

export default information;
