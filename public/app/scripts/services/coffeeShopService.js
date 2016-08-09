'use strict';

function coffeeShopService($resource) {
  return $resource('https://coffeeworkee.herokuapp.com/');
}

angular
  .module('coffeeWorkee')
  .factory('coffeeShopService', coffeeShopService);