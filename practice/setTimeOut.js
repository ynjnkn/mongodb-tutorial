console.log("Start");

setTimeout(() => {
  console.log("1초");
  setTimeout(() => {
    console.log("2초");
    setTimeout(() => {
      console.log("3초");
      setTimeout(() => {
        console.log("4초");
        setTimeout(() => {
          console.log("5초");
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

console.log("End");