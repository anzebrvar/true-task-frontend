'use strict';

var suggestions_mocked = [
  'Sorry to hear that.. Are you on wired or wifi?',
  'Have you tried rebooting the router?',
  'When did it get stuck?',
  'Have you checked for faults in the area on our website?',
  'Did you try googling it?',
  'We can send you the IT expert. What is your address?',
  'It works on my computer :)',
  'Is this the first time you encountered this error?',
  'Try refreshing the web page...',
  'I have to ask my supervisor..',
  'We can offer you a discount for the next 6 months. Can you tell me your profile ID?'
];


chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  // console.log('activating', tabId, changeInfo);
  // chrome.pageAction.show(tabId);

  // If tab URL gets updated, send reset command to clear chat messages from previous chat
  if ('url' in changeInfo){
    chrome.tabs.sendMessage(tabId, {kind: 'reset'});
  }
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    $.get('http://localhost:3000/suggestions/', request, function(response){
      sendResponse(response.data);
    });

    var response = {
      suggestions: {
        first:{
          text: suggestions_mocked[parseInt(Math.random()*suggestions_mocked.length)],
          confidence: Math.random()
        },
        second: {
          text: suggestions_mocked[parseInt(Math.random()*suggestions_mocked.length)],
          confidence: Math.random()
        },
        third: {
          text: suggestions_mocked[parseInt(Math.random()*suggestions_mocked.length)],
          confidence: Math.random()
        }
      }
    };

    sendResponse(response);
});


console.log('\'Allo \'Allo! Bacground page/script.');
