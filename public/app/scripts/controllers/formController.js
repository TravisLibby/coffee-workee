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

angular
  .module('coffeeWorkee')
  .controller('formController', formController);
