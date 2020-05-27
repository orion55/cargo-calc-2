// добавляем анимацию к объекту
const animateObj = (obj, className) => {
  obj.classList.add(className);

  setTimeout(() => {
    obj.classList.remove(className);
  }, 1000);
};

export default animateObj;
