// Message 2) Add message listener  that will listen for a specific message where '.type' refers to the key of the JSON message we sent
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'showPageAction') {
    // Message 3) If the message is 'x', it will show the page action for whichever tab the message came from. We know which tab it came from because of 'sender.tab.id'
    chrome.pageAction.show(sender.tab.id);
    // Message 4) Our content_script has a callback function which will be triggered by 'sendResponse'. This will send a JSON message to our callback function which we will display
    sendResponse({ message: 'page action received' });
  }
});
