const addSum = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a !== "number") {
        reject(`${a} is a ${typeof a}. It must be a number.`);
        return;
      } else if (typeof b !== "number") {
        reject(`${b} is a ${typeof b}. It must be a number.`);
        return;
      } else {
        resolve(a + b);
      }
    }, 500);
  });
};

addSum(0, 1)
  .then((sum) => {
    console.log({ sum1: sum });
    return addSum(sum, 1);
  })
  .then((sum) => {
    console.log({ sum2: sum });
    return addSum(sum, "NOT A NUMBER");
  })
  .then((sum) => {
    console.log({ sum3: sum });
  })
  .catch((error) => {
    console.log({ error });
  });
