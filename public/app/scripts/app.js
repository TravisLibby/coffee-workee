'use strict';

angular
  .module('coffeeWorkee', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'formController as formCtrl'
      });

    $urlRouterProvider.otherwise('/');

  });
