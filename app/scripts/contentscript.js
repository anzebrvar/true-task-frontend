'use strict';

console.log('\'Allo \'Allo! Content script');

var chatLines = [];

// Listen for events from background.js and reset chatLines if tab URL is updated
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.kind=='reset'){
        chatLines = [];
    }
});


var _onSuggestions = function(suggestions){
    console.log('received suggestions', msg);

    $.get(chrome.extension.getURL('templates/suggestions.html'), function(data) {
        var el = $('._4_j4 ._mh6');
        $(data).appendTo(el);
    });
};


var onObserve = function(mutations){
    var newChatLines = 0;

    // Parse lines from mutations
    for (var i=0; i<mutations.length; i++){
        var chatEntries = $(mutations[i].addedNodes).find('._1t_p');
        if (chatEntries.length > 0){
            for (var j=0; j<chatEntries.length; j++){
                var text = chatEntries[j].innerText.trim().split("\n");
                var author = text.shift();

                for (var k=0; k<text.length; k++){
                    chatLines.push({author: author, text: text[k]});
                    newChatLines += 1;
                }
            }
        }
    }

    // Build context and get suggestions
    if (newChatLines > 0){
        var context = chatLines.slice(-5);
        var context_string = '';
        for (var i = 0; i<context.length; i++){
            context_string += '<' + context[i].author + '> ' +  context[i].text + ' ';
        }

        console.log("Context:", context_string);

        chrome.runtime.sendMessage({context: context_string}, _onSuggestions);
    }
};


var onPageLoad = function (evt) {

    console.log('Loaded');

    // Inject loading html into messenger.com DOM.
    $.get(chrome.extension.getURL('templates/loading.html'), function(data) {
        var el = $('._4_j4 ._mh6');
        $(data).appendTo(el);
    });

    // Observe changes in chat window.
    var chatWindow = $('._4_j4')[0];
    var observer = new MutationObserver( onObserve);
    var config = { attributes: false, childList: true, characterData: false, subtree: true};
    observer.observe(chatWindow, config); //starts the actual observing of the element.

};

window.addEventListener ("load", onPageLoad, false);
