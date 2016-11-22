'use strict';

console.log('\'Allo \'Allo! Content script');

var chatLines = [];
var CONTEXT_SIZE = 3;
var CHAT_ENTRY_SELECTOR = '._o46';
var COMPANY_NAME_SELECTOR = 'h2._17w2';


// Load settings from chrome.storage
chrome.storage.sync.get({'contextSize': 3}, function(items) {
    CONTEXT_SIZE = items.contextSize;
});


// Listen for events from background.js and reset chatLines if tab URL is updated
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.kind=='reset'){
        chatLines = [];
    }
    _clearSuggestions();
});


var initAngular = function(){
    angular.element(function() {
      angular.bootstrap(document, ['suggestionsApp']);
    });
};


var _onSuggestions = function(data){
    var $scope = angular.element($('.suggestions')).scope();

    $scope.$apply(function () {
        $scope.suggestions = data.suggestions;
    });
};


var _clearSuggestions = function(){
    var $scope = angular.element($('.suggestions')).scope();

    if ($scope){
        $scope.$apply(function(){
            $scope.suggestions = null;
        });
    }
};

// Get chat context
// NOTE: This can actually be obtained on several ways. I tested this solution and I think it works, but there
// is probably a few other ways to obtain chat context.
var onObserve = function(mutations){
    var newChatLines = 0;

    // Parse lines from mutations
    for (var i=0; i<mutations.length; i++){
        var chatEntries = $.merge($(mutations[i].addedNodes).find(CHAT_ENTRY_SELECTOR), $(mutations[i].addedNodes).filter(CHAT_ENTRY_SELECTOR));
        if (chatEntries.length > 0){
            for (var j=0; j<chatEntries.length; j++){
                var text = chatEntries[j].innerText.trim();
                var author = chatEntries[j].parentElement.innerText.trim().split('\n')[0];
                chatLines.push({author: author, text: text});
                newChatLines += 1;
            }
        }
    }

    // Build context and get suggestions
    if (newChatLines > 0){
        _clearSuggestions();

        var company = $(COMPANY_NAME_SELECTOR)[0].innerText;
        var context = chatLines.slice(-CONTEXT_SIZE);
        var context_string = '';
        for (var i = 0; i<context.length; i++){
            context_string += '<' + context[i].author + '> ' +  context[i].text + ' ';
        }
        console.log('Context:', context_string);


        chrome.runtime.sendMessage({context: context_string.trim(), company: company}, _onSuggestions);
    }
};


var onPageLoad = function (evt) {

    console.log('Loaded');

    // Inject loading html into messenger.com DOM.
    $.get(chrome.extension.getURL('templates/suggestions.html'), function(data) {
        var el = $('._4_j4 ._mh6');
        $(data).appendTo(el);
        initAngular();
    });

    // Observe changes in chat window.
    var chatWindow = $('._4_j4')[0];
    var observer = new MutationObserver( onObserve);
    var config = { attributes: false, childList: true, characterData: false, subtree: true};
    observer.observe(chatWindow, config); //starts the actual observing of the element.

};

window.addEventListener ('load', onPageLoad, false);
