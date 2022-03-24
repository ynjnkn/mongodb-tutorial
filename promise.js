const addSum = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof (a) !== 'number') {
                reject(`${a} is a ${typeof (a)}. It must be a number.`);
            }
            else if (typeof (b) !== 'number') {
                reject(`${b} is a ${typeof (b)}. It must be a number.`);
            }
            resolve(a + b);
        }, 1500);
    })
}

const totalSum = async () => {
    try {
        let sum1 = await addSum(0, 1);
        console.log({ sum1 });
        let sum2 = await addSum(sum1, 1);
        console.log({ sum2 });
        let sum3 = await addSum(sum2, 'A');
        console.log({ sum3 });
        let sum4 = await addSum(sum3, 1);
        console.log({ sum4 });
        let sum5 = await addSum(sum4, 1);
        console.log({ sum5 });
    }
    catch (error) {
        console.log(error);
    }
}

totalSum();

// 성공 케이스
// addSum(10, 20)
//     .then((sum) => console.log({ sum }))
//     .catch((error) => console.log({ error }));

// 실패 케이스
// addSum(10, "B")
//     .then((sum) => console.log({ sum }))
//     .catch((error) => console.log({ error }));

// Promise Chaining 올바른 사용법
// addSum(10, 10)
//     .then((sum) => {
//         console.log({ sum1: sum });
//         return addSum(sum, 'B');
//     })
//     .then((sum) => {
//         console.log({ sum2: sum });
//         return addSum(sum, 30);
//     })
//     .then((sum) => {
//         console.log({ sum3: sum });
//     })
//     .catch((error) => console.log({ error }));

// Promise Chaining 잘못된 사용법
// addSum(10, 10)
//     .then((sum) => {
//         console.log({ sum1: sum });
//         addSum(sum, 'B')
//             .then((sum) => {
//                 console.log({ sum2: sum });
//                 addSum(sum, 30)
//                     .then((sum) => {
//                         console.log({ sum3: sum });
//                     })
//                     .catch((error) => console.log({ error }));
//             })
//             .catch((error) => console.log({ error }));
//     })
//     .catch((error) => console.log({ error }));