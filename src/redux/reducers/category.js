const initialCategory = [
  {
    key: "1",
    name: "陶瓷内胆咖啡杯",
    price: "65.99",
    address: "广西南昌"
  },
  {
    key: "2",
    name: "印花医用外科口罩",
    price: "14.50",
    address: "浙江金华"
  }
];

const categoryReducer = (state = initialCategory, { type, data }) => {
  switch (type) {
    case 'ccc':
      return [data, ...state];
    default:
      return state;
  }
};
export default categoryReducer;