'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  //chrome.pageAction.show(tabId);

  // If tab URL gets updated, send reset command to clear chat messages from previous chat
  if ('url' in changeInfo){
    chrome.tabs.sendMessage(tabId, {kind: "reset"});
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    var response = {
      suggestions: {
        first: 'This is first recommendation.',
        second: 'Please call our support number.',
        third: 'This is really hard question.. :)'
      }
    };

    sendResponse(response);
});


console.log('\'Allo \'Allo! Bacground page/script.');
