console.log('Hello World');

function accumulatedSum(a, b) {
    let accumulatedSum = 0;
    for (let i = a; i <= b; i++) {
        accumulatedSum += i;
    }
    console.log("accumulatedSum", accumulatedSum);
}

accumulatedSum(0, 10);