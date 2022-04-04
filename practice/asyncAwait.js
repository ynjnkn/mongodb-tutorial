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

const totalSum = async () => {
  console.time("totalSum Execution Duration");
  try {
    const sum1 = await addSum(0, 1);
    console.log({ sum1 });
    const sum2 = await addSum(sum1, 1);
    console.log({ sum2 });
    const sum3 = await addSum(sum2, "1");
    console.log({ sum3 });
  } catch (error) {
    console.log({ error });
  }
  console.timeEnd("totalSum Execution Duration");
};

totalSum();
