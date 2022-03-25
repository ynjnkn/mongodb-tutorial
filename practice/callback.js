let callback = (error, sum) => {
    if (error) {
        console.log({ error });
        return;
    }
    console.log({ sum });
}

const addSum = (a, b, callback) => {
    setTimeout(() => {
        if (typeof (a) !== 'number') {
            callback(`${a} is a ${typeof (a)}. It must be a number.`, undefined);
            return;
        }
        else if (typeof (b) !== 'number') {
            callback(`${b} is a ${typeof (b)}. It must be a number.`, undefined);
            return;
        }
        callback(undefined, a + b);
    }, 1500);
};

// 성공 케이스
// addSum(10, 20, callback);

// 실패 케이스
// addSum('10', 20, callback);

// 콜백헬
addSum(10, 10, (error, sum) => {
    if (error) return console.log({ error });
    console.log({ sum1: sum });
    addSum(sum, 20, (error, sum) => {
        if (error) return console.log({ error });
        console.log({ sum2: sum });
        addSum(sum, 'B', (error, sum) => {
            if (error) return console.log({ error });
            console.log({ sum3: sum });
        })
    });
})