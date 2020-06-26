// Message 1) content_script will send a JSON message to background.js and it will accept a callback function which will execute, if it receives a JSON response from background.js
chrome.runtime.sendMessage({ type: 'showPageAction' }, function (response) {
  console.log(response.message);
});

// Callback function
const getProfiles = async () => {
  try {
    // get the list of profile tag that has the class 'offeruser...info'
    const profileLists = document.querySelectorAll('.OfferUser__userInfo');

    for (i = 0; i <= 10; i++) {
      let t1 = performance.now();
      let profilePath = profileLists[i].getAttribute('href');
      let t3 = performance.now();
      const res = await fetch(`https://paxful.com${profilePath}`);
      let t4 = performance.now();
      if (!res.ok) {
        throw res.status;
      }
      let t5 = performance.now();
      const html = await res.text();
      let t6 = performance.now();

      let t7 = performance.now();
      let dummyHTML = document.createElement('html');
      dummyHTML.innerHTML = `${html}`;
      let t8 = performance.now();

      let t9 = performance.now();
      let positiveFeedback = dummyHTML.getElementsByClassName(
        'h3 m-0 text-success d-flex justify-content-between align-items-center'
      )[0].innerText;
      let negativeFeedback = dummyHTML.getElementsByClassName(
        'h3 m-0 text-danger d-flex justify-content-between align-items-center'
      )[0].innerText;
      let tradePartners = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')[2]
        .getElementsByTagName('strong')[0].innerText;
      let trades = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')[3]
        .getElementsByTagName('strong')[0].innerText;
      let tradeVolume = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')[4]
        .getElementsByTagName('strong')[0].innerText;
      let trustedBy = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')[5]
        .getElementsByTagName('strong')[0].innerText;
      let joined = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')[6]
        .getElementsByTagName('strong')[0].innerText;
      let t10 = performance.now();
      let t2 = performance.now();
      console.log(`fetch time: ${t4 - t3}`);
      console.log(`Changing to text: ${t6 - t5}`);
      console.log(`Creating dummyHTML: ${t8 - t7}`);
      console.log(`Getting elements: ${t10 - t9}`);
      console.log(`Overall: ${t2 - t1}`);
      console.log(
        `positiveFeedback=${positiveFeedback}, negativeFeedback=${negativeFeedback}, tradePartners=${tradePartners}, trades=${trades}, tradeVolume=${tradeVolume}, trustedBy=${trustedBy}, joined=${joined}`
      );
    }
  } catch (error) {
    console.error(error);
  }
};

// This will only call the callback function once the page has fully loaded
window.addEventListener('load', getProfiles);
