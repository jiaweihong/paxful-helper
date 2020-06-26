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
      let profilePath = profileLists[i].getAttribute('href');

      const res = await fetch(`https://paxful.com${profilePath}`);

      if (!res.ok) {
        throw res.status;
      }

      const html = await res.text();

      let dummyHTML = document.createElement('html');
      dummyHTML.innerHTML = `${html}`;

      let positiveFeedback = dummyHTML.getElementsByClassName(
        'h3 m-0 text-success d-flex justify-content-between align-items-center'
      )[0].innerText;
      let negativeFeedback = dummyHTML.getElementsByClassName(
        'h3 m-0 text-danger d-flex justify-content-between align-items-center'
      )[0].innerText;

      let lengthInfo = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item').length;

      let tradePartners = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')
        [lengthInfo - 5].getElementsByTagName('strong')[0].innerText;
      let trades = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')
        [lengthInfo - 4].getElementsByTagName('strong')[0].innerText;
      let tradeVolume = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')
        [lengthInfo - 3].getElementsByTagName('strong')[0].innerText;
      let trustedBy = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')
        [lengthInfo - 2].getElementsByTagName('strong')[0].innerText;
      // problem is that the sometimes people dont select a language, which messes up the number in the list therefore not 6 index does not exist.
      // fix by getting the total items in the group list and -1 to get items from the back
      let joined = dummyHTML
        .getElementsByClassName('list-group')[1]
        .getElementsByClassName('list-group-item')
        [lengthInfo - 1].getElementsByTagName('strong')[0].innerText;

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
