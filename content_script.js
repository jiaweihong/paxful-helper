// Message 1) content_script will send a JSON message to background.js and it will accept a callback function which will execute, if it receives a JSON response from background.js
chrome.runtime.sendMessage({ type: 'showPageAction' }, function (response) {
  console.log(response.message);
});

const getProfiles = () => {
  console.log(document.querySelectorAll('.OfferUser__userInfo'));
};

window.addEventListener('load', getProfiles);