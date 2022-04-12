/*
const array1 = [1, 2, 3, 4, 5];
const numOfShift = 3;
for (let i = 0; i < numOfShift; i++) {
  if (array1.length === 0) {
    console.log("array1 is empty.");
    break;
  }
  console.log(`${i + 1}번째 shift`);
  array1.shift();
}

console.log({ array1 });
//*/

const numOfShift = 6;
const array1 = [1, 2, 3, 4, 5];
console.log(`array1: [${array1}]`);
for (let i = 0; i < numOfShift; i++) {
  const shiftedElement = array1.shift();
  if (typeof shiftedElement === "undefined") {
    console.log(`[${i + 1}/${numOfShift}] FAIL => array1 is empty.`);
    console.log(`==== Shift Operation Complete ====`);
    console.log(`Number of Shifts Attempted: ${numOfShift}`);
    console.log(`Number of Shifts Succeeded: ${i}`);
    break;
  }
  if (i + 1 === numOfShift) {
    console.log(`[${i + 1}/${numOfShift}] SUCCESS => array1: [${array1}]`);
    console.log(`==== Shift Operation Complete ====`);
    console.log(`Number of Shifts Attempted: ${numOfShift}`);
    console.log(`Number of Shifts Succeeded: ${i + 1}`);
    break;
  }
  console.log(`[${i + 1}/${numOfShift}] SUCCESS => array1: [${array1}]`);
}

/*
const myFish = ["angel", "clown", "mandarin", "surgeon"];
console.log(`myFish BEFORE: ${myFish}`);
const shifted = myFish.shift();
console.log(`myFish AFTER: ${myFish}`);
console.log(`Removed this element: ${shifted}`);
//*/

/*
const names = ["Andrew", "Edward", "Paul", "Chris", "John"];
while (typeof (i = names.shift()) !== "undefined") {
  console.log(i);
}
//*/
