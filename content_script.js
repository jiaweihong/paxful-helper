// Message 1) content_script will send a JSON message to background.js and it will accept a callback function which will execute, if it receives a JSON response from background.js
chrome.runtime.sendMessage({ type: 'showPageAction' }, function (response) {
  console.log(response.message);
});

const getProfiles = () => {
  const offerList = document.getElementsByClassName('Offer__content');
  for (tradeNum = 0; tradeNum < offerList.length; tradeNum++) {
    getProfile(tradeNum);
  }
};

// Callback function
const getProfile = async (tradeNum) => {
  try {
    // get the list of profile tag that has the class 'offeruser...info'
    // const profileLists = document.querySelectorAll('.OfferUser__userInfo');
    let profilePath = document
      .getElementsByClassName('Offer__content')
      [tradeNum].querySelector('.OfferUser__userInfo')
      .getAttribute('href');

    const res = await fetch(`https://paxful.com${profilePath}`);

    if (!res.ok) {
      throw res.status;
    }

    const html = await res.text();

    let dummyHTML = document.createElement('html');
    dummyHTML.innerHTML = `${html}`;

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
    let joined = dummyHTML
      .getElementsByClassName('list-group')[1]
      .getElementsByClassName('list-group-item')
      [lengthInfo - 1].getElementsByTagName('strong')[0].innerText;
    let verifiedDataContent = dummyHTML
      .getElementsByClassName('list-group-item d-flex align-items-center')[2]
      .querySelector('span')
      .getAttribute('data-content');
    let verifiedArray = verifiedDataContent.split(' ');
    let verifiedDate = verifiedArray.slice(6, 12).join(' ');

    // Create a paragraph element then createTextNode and append it to the new paragraph element.
    let negativeFeedbackPara = document.createElement('p');
    let negativeFeedbackText = document.createTextNode(
      `Negative Feedback: ${negativeFeedback}`
    );
    negativeFeedbackPara.appendChild(negativeFeedbackText);
    document
      .getElementsByClassName('Offer__content')
      [tradeNum].getElementsByClassName(
        'order-1 col-5 col-lg-2 d-flex flex-column pr-0'
      )[0]
      .appendChild(negativeFeedbackPara);

    let tradePartnersPara = document.createElement('p');
    let tradePartnersText = document.createTextNode(
      `Trade Partners: ${tradePartners}`
    );
    tradePartnersPara.appendChild(tradePartnersText);
    document
      .getElementsByClassName('Offer__content')
      [tradeNum].getElementsByClassName(
        'order-1 col-5 col-lg-2 d-flex flex-column pr-0'
      )[0]
      .appendChild(tradePartnersPara);

    let tradeVolumePara = document.createElement('p');
    let tradeVolumeText = document.createTextNode(
      `Trade Volume: ${tradeVolume}`
    );
    tradeVolumePara.appendChild(tradeVolumeText);
    document
      .getElementsByClassName('Offer__content')
      [tradeNum].getElementsByClassName(
        'order-1 col-5 col-lg-2 d-flex flex-column pr-0'
      )[0]
      .appendChild(tradeVolumePara);

    let tradesPara = document.createElement('p');
    let tradesText = document.createTextNode(`No. Trades: ${trades}`);
    tradesPara.appendChild(tradesText);
    document
      .getElementsByClassName('Offer__content')
      [tradeNum].getElementsByClassName(
        'order-1 col-5 col-lg-2 d-flex flex-column pr-0'
      )[0]
      .appendChild(tradesPara);

    let verifiedDatePara = document.createElement('p');
    let verifiedDateText = document.createTextNode(
      `ID Verified via: ${verifiedDate}`
    );
    verifiedDatePara.appendChild(verifiedDateText);
    document
      .getElementsByClassName('Offer__content')
      [tradeNum].getElementsByClassName(
        'order-1 col-5 col-lg-2 d-flex flex-column pr-0'
      )[0]
      .appendChild(verifiedDatePara);
  } catch (error) {
    console.error(error);
  }
};

// This will only call the callback function once the page has fully loaded
window.addEventListener('load', getProfiles);
