console.log('Content script loaded');

// Message 1) content_script will send a JSON message to background.js and it will accept a callback function which will execute, if it receives a JSON response from background.js
chrome.runtime.sendMessage({ type: 'showPageAction' }, function (response) {
  console.log(response.message);
});

const fetchUsers = async () => {
  try {
    const response = await fetch('https://reqres.in/api/users');
    console.log(typeof response);
    if (!response.ok) {
      return response.status;
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

fetchUsers();

// var xhr = new XMLHttpRequest();
// const secret = 'THJEBJoKQZhlGbAIb1QQF5QCZ7TCeyBu';
// const apikey = 'f55I0C4aoAB12uOvQLAhVoQi7qiMhB40';
// var body = `apikey=${apikey}&nonce=${Date.now()}&offer_hash=Agq1Bpw7oX9&margin=50`;

// var seal = CryptoJS.HmacSHA256(body, secret);
// try {
//   xhr.open('post', 'https://www.paxful.com/api/wallet/balance', true);
//   xhr.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       console.log(this.response);
//     }
//   };
//   xhr.setRequestHeader('Content-Type', 'text/plain');
//   xhr.setRequestHeader('Accept', 'application/json');
//   xhr.send(body + '&apiseal=' + seal);
// } catch (error) {
//   console.error(error);
// }
