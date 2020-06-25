// Message 1) content_script will send a JSON message to background.js and it will accept a callback function which will execute, if it receives a JSON response from background.js
chrome.runtime.sendMessage({ type: 'showPageAction' }, function (response) {
  console.log(response.message);
});

// Callback function
const getProfiles = async () => {
  try {
    // get the list of profile tag that has the class 'offeruser...info'
    const profileLists = document.querySelectorAll('.OfferUser__userInfo');

    for (i = 0; i <= 5; i++) {
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
    }
    // // get the path of the first profile
    // let profilePath = profileLists[0].getAttribute('href');

    // // make a fetch request to the profile's URL
    // const res = await fetch(`https://paxful.com${profilePath}`);
    // if (!res.ok) {
    //   throw res.status;
    // }

    // // returns the HTML as a string
    // // const html = await res.text();

    // // let dummyHTML = document.createElement('html');
    // // dummyHTML.innerHTML = `${html}`;
    // // console.log(
    // //   dummyHTML.getElementsByClassName(
    // //     'h3 m-0 text-success d-flex justify-content-between align-items-center'
    // //   )[0].innerText
    // // );
  } catch (error) {
    console.error(error);
  }
};

// This will only call the callback function once the page has fully loaded
window.addEventListener('load', getProfiles);

// open the up the href link, make a axios request to get the DOM of the page and insert it into Dom
