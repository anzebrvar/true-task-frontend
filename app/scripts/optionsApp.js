
var app = angular.module('optionsApp',[]);

app.controller('OptionsController', function OptionsController($scope) {

  $scope.contextSize = 3;

  chrome.storage.sync.get(['contextSize'], function(items) {
    console.log("restoring items", items);

    if (items.contextSize){
      $scope.$apply(function(){
        $scope.contextSize = items.contextSize;
      });
    }
  });

  $scope.$watch('contextSize', function(newValue){
    console.log('saving new contextSize', newValue);
    chrome.storage.sync.set({
      contextSize: newValue
    });
  });

});
