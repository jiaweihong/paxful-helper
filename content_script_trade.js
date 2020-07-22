const getTradeInfo = async () => {
  try {
    var username = document
      .querySelector('a[class="qa-username"]')
      .getAttribute('title');
    console.log(username);
    var line = document.createElement('hr');
    document.querySelector('div[id="info_block"]').appendChild(line);

    // get a full breakdown of past 1000 feedbacks
    // Getting the first page of buy and sell just to see how many pages we need to call
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

    let numberOfBuyerFeedbackPages = Math.ceil(buyerFeedbackData.total / 15);
    let numberOfSellerFeedbackPages = Math.ceil(sellerFeedbackData.total / 15);

    if (numberOfBuyerFeedbackPages > 33) {
      numberOfBuyerFeedbackPages = 33;
    }
    if (numberOfSellerFeedbackPages > 33) {
      numberOfSellerFeedbackPages = 33;
    }

    // Querying all the buyer feedback pages and adding the promise to an array
    const buyerFeedbackPagesPromises = [];
    for (let page = 1; page <= numberOfBuyerFeedbackPages; page++) {
      buyerFeedbackPagesPromises.push(
        fetch(
          `https://paxful.com/rest/v1/users/${username}/feedbacks?camelCase=1&feedback=all&offer_type=sell&f_page=${page}`
        )
      );
    }
    // Querying all the seller feedback pages and adding the promise to an array
    const sellerFeedbackPagesPromises = [];
    for (let page = 1; page <= numberOfSellerFeedbackPages; page++) {
      sellerFeedbackPagesPromises.push(
        fetch(
          `https://paxful.com/rest/v1/users/${username}/feedbacks?camelCase=1&feedback=all&offer_type=buy&f_page=${page}`
        )
      );
    }

    // Awaiting the promises to resolve
    const buyerFeedbackResponses = await Promise.all(
      buyerFeedbackPagesPromises
    );
    const sellerFeedbackResponses = await Promise.all(
      sellerFeedbackPagesPromises
    );

    // Turning the buyer feedback resolved promises into JSON promises
    let buyerFeedbackJsonPromises = [];
    for (response in buyerFeedbackResponses) {
      buyerFeedbackJsonPromises.push(buyerFeedbackResponses[response].json());
    }
    // Turning the seller feedback resolved promises into JSON promises
    let sellerFeedbackJsonPromises = [];
    for (response in sellerFeedbackResponses) {
      sellerFeedbackJsonPromises.push(sellerFeedbackResponses[response].json());
    }

    // awaiting the JSON promises to resolve
    let buyerFeedbackJsons = await Promise.all(buyerFeedbackJsonPromises);
    let sellerFeedbackJsons = await Promise.all(sellerFeedbackJsonPromises);

    // initializing empty arrays to put all the methods into
    let buyerFeedbackPaymentMethodName = [];
    let sellerFeedbackPaymentMethodName = [];

    // Looping through the buyer and seller feedback data individually, adding a count everytime a data is matched
    for (json in buyerFeedbackJsons) {
      for (i in buyerFeedbackJsons[json].data) {
        buyerFeedbackPaymentMethodName.push(
          buyerFeedbackJsons[json].data[i].paymentMethodName
        );
      }
    }
    for (json in sellerFeedbackJsons) {
      for (i in sellerFeedbackJsons[json].data) {
        sellerFeedbackPaymentMethodName.push(
          sellerFeedbackJsons[json].data[i].paymentMethodName
        );
      }
    }

    // Sort the array into alphabetical groups
    buyerFeedbackPaymentMethodName.sort();
    sellerFeedbackPaymentMethodName.sort();

    // Create an array of just the unique payment method from each group
    let uniqueBuyerFeedbackPaymentMethod = [
      ...new Set(buyerFeedbackPaymentMethodName),
    ];
    let uniqueSellerFeedbackPaymentMethod = [
      ...new Set(sellerFeedbackPaymentMethodName),
    ];

    // Initialize a place to put the count for each payment method
    let uniqueBuyerPaymentMethodCount = [];
    let uniqueSellerPaymentMethodCount = [];

    // Loop through the unique payment methods
    for (i in uniqueBuyerFeedbackPaymentMethod) {
      // Create a variable ( and put it inside an array ) that references the current unique payment method that is being looped through and add 1 to the count everytime, it matches a value inside the main payment method array.
      let buyerStr = `buyerPaymentMethod${i} = 0`;
      uniqueBuyerPaymentMethodCount.push(eval(buyerStr));
      for (y in buyerFeedbackPaymentMethodName) {
        if (
          uniqueBuyerFeedbackPaymentMethod[i] ==
          buyerFeedbackPaymentMethodName[y]
        ) {
          uniqueBuyerPaymentMethodCount[i] += 1;
        }
      }
    }
    for (i in uniqueSellerFeedbackPaymentMethod) {
      let sellerStr = `sellerPaymentMethod${i} = 0`;
      uniqueSellerPaymentMethodCount.push(eval(sellerStr));
      for (y in sellerFeedbackPaymentMethodName) {
        if (
          uniqueSellerFeedbackPaymentMethod[i] ==
          sellerFeedbackPaymentMethodName[y]
        ) {
          uniqueSellerPaymentMethodCount[i] += 1;
        }
      }
    }

    // initialize unsorted feedback object
    let buyerFeedbackObject = {};
    let sellerFeedbackObject = {};

    // Match our array of payment method count variables to our unique payment method
    for (i in uniqueBuyerFeedbackPaymentMethod) {
      buyerFeedbackObject[uniqueBuyerFeedbackPaymentMethod[i]] =
        uniqueBuyerPaymentMethodCount[i];
    }
    for (i in uniqueSellerFeedbackPaymentMethod) {
      sellerFeedbackObject[uniqueSellerFeedbackPaymentMethod[i]] =
        uniqueSellerPaymentMethodCount[i];
    }

    // initialize an array to that will turn our key values pairs into an array of arrays
    let buyerFeedbackArrayToSort = [];
    let sellerFeedbackArrayToSort = [];

    // Push the values into the array
    for (buyerPaymentType in buyerFeedbackObject) {
      buyerFeedbackArrayToSort.push([
        buyerPaymentType,
        buyerFeedbackObject[buyerPaymentType],
      ]);
    }
    for (sellerPaymentType in sellerFeedbackObject) {
      sellerFeedbackArrayToSort.push([
        sellerPaymentType,
        sellerFeedbackObject[sellerPaymentType],
      ]);
    }

    // Sort each individual array descendingly
    // Takes the 1st index (count value) of each array pair and compares them
    buyerFeedbackArrayToSort.sort((a, b) => {
      return b[1] - a[1];
    });
    sellerFeedbackArrayToSort.sort((a, b) => {
      return b[1] - a[1];
    });

    // Initialize the sorted object
    let sortedBuyerFeedbackObject = {};
    let sortedSellerFeedbackObject = {};

    // loop through the sorted array and create sorted key-value pairs with it
    buyerFeedbackArrayToSort.forEach((feedback) => {
      sortedBuyerFeedbackObject[feedback[0]] = feedback[1];
    });
    sellerFeedbackArrayToSort.forEach((feedback) => {
      sortedSellerFeedbackObject[feedback[0]] = feedback[1];
    });

    console.log(sortedBuyerFeedbackObject);
    console.log(sortedSellerFeedbackObject);
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener('load', getTradeInfo);
