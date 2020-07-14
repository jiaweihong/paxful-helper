// Message 1) content_script will send a JSON message to background.js and it will accept a callback function which will execute, if it receives a JSON response from background.js
chrome.runtime.sendMessage({ type: 'showPageAction' }, function (response) {
  console.log(response.message);
});

const getProfiles = () => {
  // Gets an array of all the offers
  const offerList = document.getElementsByClassName('Offer__content');

  // Calls all the getProfile index in a single loop without waiting for each function to finish
  for (tradeNum = 0; tradeNum < offerList.length; tradeNum++) {
    // pass the index value of the array (tradeNum) to the getProfile() as an argument
    getProfile(tradeNum);
  }
};

const getFeedback = async (tradeNum) => {
  // feedback
  const paymentType = document.querySelectorAll(
    'p[class="m-0 regular-24 OfferPaymentMethod__paymentMethodName"]'
  )[tradeNum].innerText;
  const username = document.querySelectorAll('a[class="OfferUser__userInfo"]')[
    tradeNum
  ].innerText;

  const fetchBuyerFeedbackPage1 = fetch(
    `https://paxful.com/rest/v1/users/${username}/feedbacks?camelCase=1&feedback=all&offer_type=sell&f_page=1`
  );
  const fetchSellerFeedbackPage1 = fetch(
    `https://paxful.com/rest/v1/users/${username}/feedbacks?camelCase=1&feedback=all&offer_type=buy&f_page=1`
  );

  const page1FeedbackResponse = await Promise.all([
    fetchBuyerFeedbackPage1,
    fetchSellerFeedbackPage1,
  ]);

  const buyerFeedbackData = await page1FeedbackResponse[0].json();
  const sellerFeedbackData = await page1FeedbackResponse[1].json();

  const numberOfBuyerFeedbackPages = Math.ceil(buyerFeedbackData.total / 15);
  const numberOfSellerFeedbackPages = Math.ceil(sellerFeedbackData.total / 15);

  let buyerFeedbackArray = [];
  const buyerFeedbackPagesPromises = [];
  for (let page = 1; page <= numberOfBuyerFeedbackPages; page++) {
    buyerFeedbackPagesPromises.push(
      fetch(
        `https://paxful.com/rest/v1/users/${username}/feedbacks?camelCase=1&feedback=all&offer_type=sell&f_page=${page}`
      )
    );
  }
  const buyerFeedbackResponses = await Promise.all(buyerFeedbackPagesPromises);
  let buyerFeedbackJsonPromises = [];
  for (response in buyerFeedbackResponses) {
    buyerFeedbackJsonPromises.push(buyerFeedbackResponses[response].json());
  }
  let buyerFeedbackJsons = await Promise.all(buyerFeedbackJsonPromises);

  for (json in buyerFeedbackJsons) {
    console.log(buyerFeedbackJsons[json]);
    for (i in buyerFeedbackJsons[json].data) {
      if (buyerFeedbackJsons[json].data[i].paymentMethodName == paymentType) {
        buyerFeedbackArray.push(
          buyerFeedbackJsons[json].data[i].paymentMethodName
        );
      }
    }
  }

  let sellerFeedbackArray = [];
  const sellerFeedbackPagesPromises = [];
  for (let page = 1; page <= numberOfSellerFeedbackPages; page++) {
    sellerFeedbackPagesPromises.push(
      fetch(
        `https://paxful.com/rest/v1/users/${username}/feedbacks?camelCase=1&feedback=all&offer_type=buy&f_page=${page}`
      )
    );
  }
  const sellerFeedbackResponses = await Promise.all(
    sellerFeedbackPagesPromises
  );
  let sellerFeedbackJsonPromises = [];
  for (response in sellerFeedbackResponses) {
    sellerFeedbackJsonPromises.push(sellerFeedbackResponses[response].json());
  }
  let sellerFeedbackJsons = await Promise.all(sellerFeedbackJsonPromises);

  for (json in sellerFeedbackJsons) {
    for (i in sellerFeedbackJsons[json].data) {
      if (sellerFeedbackJsons[json].data[i].paymentMethodName == paymentType) {
        sellerFeedbackArray.push(
          sellerFeedbackJsons[json].data[i].paymentMethodName
        );
      }
    }
  }

  const totalNumberOfFeedbackWithPaymentX =
    sellerFeedbackArray.length + buyerFeedbackArray.length;

  const totalFeedbackOfBitcoinSoldWithPaymentX = buyerFeedbackArray.length;
  const totalFeedbackOfBitcoinBoughtWithPaymentX = sellerFeedbackArray.length;

  let feedbackPara = document.createElement('p');
  let feedbackText = document.createTextNode(
    `Total ${paymentType} feedback: ${totalNumberOfFeedbackWithPaymentX} `
  );
  feedbackPara.appendChild(feedbackText);
  document
    .getElementsByClassName('Offer__content')
    [tradeNum].querySelector(
      'div[class="col order-5 order-lg-2 mt-2 mt-lg-0 qa-paymentMethodGroup"]'
    )
    .appendChild(feedbackPara);

  let buyerFeedbackPara = document.createElement('p');
  let buyerFeedbackText = document.createTextNode(
    `No. feedback for buying bitcoin with ${paymentType}: ${totalFeedbackOfBitcoinBoughtWithPaymentX} `
  );
  buyerFeedbackPara.appendChild(buyerFeedbackText);
  document
    .getElementsByClassName('Offer__content')
    [tradeNum].querySelector(
      'div[class="col order-5 order-lg-2 mt-2 mt-lg-0 qa-paymentMethodGroup"]'
    )
    .appendChild(buyerFeedbackPara);

  let sellerFeedbackPara = document.createElement('p');
  let sellerFeedbackText = document.createTextNode(
    `No. feedback for selling bitcoin with ${paymentType}: ${totalFeedbackOfBitcoinSoldWithPaymentX} `
  );
  sellerFeedbackPara.appendChild(sellerFeedbackText);
  document
    .getElementsByClassName('Offer__content')
    [tradeNum].querySelector(
      'div[class="col order-5 order-lg-2 mt-2 mt-lg-0 qa-paymentMethodGroup"]'
    )
    .appendChild(sellerFeedbackPara);
  console.log(tradeNum);
};

// Callback function
const getProfile = async (tradeNum) => {
  try {
    // Retrieves the profile's URL link
    const profilePath = document
      .getElementsByClassName('Offer__content')
      [tradeNum].querySelector('.OfferUser__userInfo')
      .getAttribute('href');

    const res = await fetch(`https://paxful.com${profilePath}`);

    if (!res.ok) {
      throw res.status;
    }
    // Returns the HTML content of a page as text
    const html = await res.text();

    // Create a dummy HTML page that will convert the HTML string into an actual HTML page
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
    let verifiedDate = verifiedArray.slice(9, 12).join(' ');

    // Create a paragraph element then createTextNode and append it to the new paragraph element.
    let negativeFeedbackPara = document.createElement('p');
    // Image 1) When using images that you want to insert into the content of a page, you need to define it in the web_accessible_resources.
    // Image 2) Create an image element
    let negativeFeedbackIMG = document.createElement('img');
    // Image 3) When setting the value for src, you need to use chrome.runtime.getURL api as it convert the path to a fully qualified URL that is relative to your extension. Otherwise, it will read the path relative to the website, i.e paxful.com/images/dislike.svg
    negativeFeedbackIMG.src = chrome.runtime.getURL('images/dislike.svg');
    negativeFeedbackIMG.height = 16;
    negativeFeedbackIMG.width = 16;
    let negativeFeedbackText = document.createTextNode(`${negativeFeedback}`);
    negativeFeedbackPara.appendChild(negativeFeedbackIMG);
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
        'col-3 d-none d-lg-block order-lg-3 mt-4 regular-20 text-right'
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
        'col-3 d-none d-lg-block order-lg-3 mt-4 regular-20 text-right'
      )[0]
      .appendChild(tradeVolumePara);

    let tradesPara = document.createElement('p');
    let tradesText = document.createTextNode(`No. Trades: ${trades}`);
    tradesPara.appendChild(tradesText);
    document
      .getElementsByClassName('Offer__content')
      [tradeNum].getElementsByClassName(
        'col-3 d-none d-lg-block order-lg-3 mt-4 regular-20 text-right'
      )[0]
      .appendChild(tradesPara);

    let verifiedDatePara = document.createElement('p');
    let verifiedDateIMG = document.createElement('img');
    verifiedDateIMG.src = chrome.runtime.getURL('images/user.png');
    verifiedDateIMG.height = 20;
    verifiedDateIMG.width = 20;
    let verifiedDateText = document.createTextNode(`  ${verifiedDate}`);
    verifiedDatePara.appendChild(verifiedDateIMG);
    verifiedDatePara.appendChild(verifiedDateText);
    document
      .getElementsByClassName('Offer__content')
      [tradeNum].getElementsByClassName(
        'order-1 col-5 col-lg-2 d-flex flex-column pr-0'
      )[0]
      .appendChild(verifiedDatePara);

    let feedbackButton = document.createElement('button');
    let feedbackButtonText = document.createTextNode('Get Feedback');
    feedbackButton.appendChild(feedbackButtonText);
    // When setting the value for 'onclick', when have to make sure it knows we are referencing the function getFeedback that exists inside this file
    // If we wrote `getFeedback(${tradeNum})` it would look for the function getFeedback inside chrome
    feedbackButton.onclick = () => {
      getFeedback(tradeNum);
    };
    document
      .getElementsByClassName('Offer__content')
      [tradeNum].querySelector(
        'div[class="col order-5 order-lg-2 mt-2 mt-lg-0 qa-paymentMethodGroup"]'
      )
      .appendChild(feedbackButton);
  } catch (error) {
    console.error(error);
  }
};

// This will only call the callback function once the page has fully loaded
window.addEventListener('load', getProfiles);
