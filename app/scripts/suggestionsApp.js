
var app = angular.module('suggestionsApp',[]);

app.controller('ChoiceController', function ChoiceController($scope) {

  $scope.suggestions = null;

  $scope.insertMessage = function(msg){
    console.log('TODO: implement injecting message to input box.', msg);
  }

});
