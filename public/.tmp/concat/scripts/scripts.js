'use strict';

angular
  .module('coffeeWorkee', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router'
  ])
  .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'formController as formCtrl'
      });

    $urlRouterProvider.otherwise('/');

  }]);

'use strict';

function formController(coffeeShopService, $timeout) {

  var self = this;

  self.formData = {
    location: '',
    food: true,
    dogFriendly: true
  };

  self.currentStep = 1;
  self.completedSteps = [];
  self.coffeeShops = {};
  self.isLoading = false;
  self.isComplete = false;

  self.nextStep = function() {
    if (self.currentStep < 3) {
      self.completedSteps.push(self.currentStep);
      self.currentStep++;
    }
  };

  self.isCurrentStep = function(step) {
    return step === self.currentStep;
  };

  self.isCompletedStep = function(step) {
    return self.completedSteps.indexOf(step) !== -1;
  };

  self.processForm = function() {
    if (self.currentStep === 3) {
      self.completedSteps.push(self.currentStep);
      self.currentStep++;
      self.isLoading = true;
      coffeeShopService.save(self.formData, function(response) {
        self.coffeeShops = response.businesses;
        self.getRandomCoffeeShop();
        self.isLoading = false;
        self.isComplete = true;
        console.log('All coffee shops: ', self.coffeeShops);
      });
      // Set a timeout for a pending request - the yelp api does not provide a response for a bad query
      $timeout(function() {
        self.isLoading = false;
        self.isComplete = true;
      }, 10000);
    }
    return;
  };

  self.getRandomCoffeeShop = function() {
    self.selectedCoffeeShop = self.coffeeShops[Math.floor(Math.random() * self.coffeeShops.length)];
    self.selectedCoffeeShopName = self.selectedCoffeeShop.name;
    self.selectedCoffeeShopAddress = self.selectedCoffeeShop.location.display_address;
  };

  self.refreshSearch = function(coffeeShopId) {
    _.remove(self.coffeeShops, {id: coffeeShopId});
    if (self.coffeeShops.length > 0) {
      self.getRandomCoffeeShop();   
    } else {
      return;
    }      
  };

  self.startOver = function() {
    self.currentStep = 1;
    self.completedSteps = [];
    self.isComplete = false;
    self.formData = {
      location: '',
      food: true,
      dogFriendly: true
    };
  };

}
formController.$inject = ["coffeeShopService", "$timeout"];

angular
  .module('coffeeWorkee')
  .controller('formController', formController);

'use strict';

function coffeeShopService($resource) {
  return $resource('https://coffeeworkee.herokuapp.com/');
}
coffeeShopService.$inject = ["$resource"];

angular
  .module('coffeeWorkee')
  .factory('coffeeShopService', coffeeShopService);
angular.module('coffeeWorkee').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<div class=\"jumbotron wizard\"> <div class=\"container\"> <div class=\"row steps\"> <div class=\"col-xs-4\"> <div class=\"step-icon\" ng-class=\"{'active': formCtrl.isCurrentStep(1), 'complete': formCtrl.isCompletedStep(1)}\"> <i class=\"fa fa-map-marker\" aria-hidden=\"true\"></i> </div> </div> <div class=\"col-xs-4\"> <div class=\"step-icon\" ng-class=\"{'active': formCtrl.isCurrentStep(2), 'complete': formCtrl.isCompletedStep(2)}\"> <i class=\"fa fa-cutlery\" aria-hidden=\"true\"></i> </div> </div> <div class=\"col-xs-4\"> <div class=\"step-icon\" ng-class=\"{'active': formCtrl.isCurrentStep(3), 'complete': formCtrl.isCompletedStep(3)}\"> <i class=\"fa fa-paw\" aria-hidden=\"true\"></i> </div> </div> </div> </div> </div> <div class=\"container\"> <div class=\"row\"> <form class=\"col-xs-12 col-sm-4 col-sm-offset-4\" name=\"coffeeForm\" ng-hide=\"coffeeForm.$submitted && formCtrl.isComplete\" ng-submit=\"processForm();\"> <div class=\"form-group\" ng-if=\"formCtrl.currentStep === 1\"> <h3 class=\"text-center\">Where are you?</h3> <input type=\"text\" class=\"form-control input-lg\" name=\"location\" placeholder=\"What city, town, address, or zip code?\" ng-model=\"formCtrl.formData.location\"> </div> <div class=\"form-group\" ng-if=\"formCtrl.currentStep === 2\"> <h3 class=\"text-center\">Fancy a bite to eat?</h3> <div class=\"text-center\"> <label class=\"radio-inline\"> <input type=\"radio\" name=\"food\" ng-value=\"true\" ng-model=\"formCtrl.formData.food\" checked> Yes, please. </label> <label class=\"radio-inline\"> <input type=\"radio\" name=\"food\" id=\"no\" ng-value=\"false\" ng-model=\"formCtrl.formData.food\"> No thanks. </label> </div> </div> <div class=\"form-group\" ng-if=\"formCtrl.currentStep === 3\"> <h3 class=\"text-center\">Want to bring Fido?</h3> <div class=\"text-center\"> <label class=\"radio-inline\"> <input type=\"radio\" name=\"dogs\" id=\"casual\" ng-value=\"true\" ng-model=\"formCtrl.formData.dogFriendly\" checked> Yes </label> <label class=\"radio-inline\"> <input type=\"radio\" name=\"dogs\" id=\"fancy\" ng-value=\"false\" ng-model=\"formCtrl.formData.dogFriendly\"> No </label> </div> </div> <button ng-show=\"formCtrl.currentStep < 3\" type=\"button\" class=\"btn btn-success btn-lg center-block\" ng-disabled=\"!formCtrl.formData.location\" ng-click=\"formCtrl.nextStep();\">Next</button> <button ng-if=\"formCtrl.currentStep === 3\" type=\"submit\" class=\"btn btn-success btn-lg center-block\" ng-click=\"formCtrl.processForm();\">Submit</button> </form> <div ng-if=\"formCtrl.isComplete\"> <div class=\"row\"> <div class=\"col-xs-12 col-sm-4 col-sm-offset-4\"> <h3 class=\"text-center\">{{ formCtrl.coffeeShops.length > 1 ? 'How about giving this place a try?' : \"I'm sorry, some problem seems to have occured. Please, either try again later or start over.\" }}</h3> </div> </div> <div ng-if=\"formCtrl.coffeeShops.length > 0\"> <div class=\"row\"> <div class=\"col-xs-12 col-sm-4 col-sm-offset-4\"> <h4 class=\"text-center\">{{ formCtrl.selectedCoffeeShopName }}</h4> <address class=\"text-center\"> <span ng-repeat=\"addressLine in formCtrl.selectedCoffeeShopAddress\"> {{ addressLine }}<br> </span> <a ng-href=\"{{ formCtrl.selectedCoffeeShop.url }}\" target=\"_blank\">Check it out on Yelp!</a> </address> </div> </div> <div class=\"row refresh-result\"> <div class=\"col-xs-12 col-sm-4 col-sm-offset-4\"> <button type=\"button\" class=\"btn btn-success center-block\" ng-click=\"formCtrl.refreshSearch(formCtrl.selectedCoffeeShop.id);\"><i class=\"fa fa-refresh\" aria-hidden=\"true\"></i></button> </div> </div> </div> <div class=\"row\"> <div class=\"col-xs-12 col-sm-4 col-sm-offset-4\"> <button type=\"button\" class=\"btn btn-default center-block\" ng-click=\"formCtrl.startOver();\">Start Over</button> </div> </div> </div> <div class=\"row\"> <div class=\"col-xs-12\"> <div class=\"text-center\" ng-if=\"formCtrl.isLoading\"> <i class=\"fa fa-spinner fa-pulse fa-3x fa-fw\"></i> <span class=\"sr-only\">Loading...</span> </div> </div> </div> </div> </div>"
  );

}]);
