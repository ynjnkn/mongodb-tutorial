const callback = (error, sum) => {
  if (error) {
    console.log({ error });
    return;
  }
  console.log({ sum });
};

const addSum = (a, b, callback) => {
  setTimeout(() => {
    if (typeof a !== "number") {
      callback(`${a} is a ${typeof a}. It must be a number.`, undefined);
      return;
    } else if (typeof b !== "number") {
      callback(`${b} is a ${typeof b}. It must be a number.`, undefined);
      return;
    } else {
      callback(undefined, a + b);
    }
  }, 500);
};

addSum(0, 1, (error, sum) => {
  if (error) return console.log({ error });
  console.log({ sum1: sum });
  addSum(sum, 1, (error, sum) => {
    if (error) return console.log({ error });
    console.log({ sum2: sum });
    addSum(sum, 1, (error, sum) => {
      if (error) return console.log({ error });
      console.log({ sum3: sum });
      addSum(sum, 1, (error, sum) => {
        if (error) return console.log({ error });
        console.log({ sum4: sum });
        addSum(sum, 'NOT A NUMBER', (error, sum) => {
          if (error) return console.log({ error });
          console.log({ sum5: sum });
        });
      });
    });
  });
});