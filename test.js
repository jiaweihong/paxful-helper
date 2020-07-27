const resolve = async () => {
  let p1 = Promise.resolve('promise 1');
  let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('promise 2');
    }, 5000);
  });
  let p3 = new Promise((resolve, reject) => {
    resolve('promise 3');
  });
  let p4 = await fetch('http://www.maybank3u.com/');

  var promises = [p1, p2, p3, p4];
  console.log(promises);
  const responses = await Promise.all(promises).catch((err) => {
    console.log(`${err} custom error`);
  });

  for (i in responses) {
    console.log(responses[i]);
  }
};

resolve();
