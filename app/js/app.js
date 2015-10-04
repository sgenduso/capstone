var app = angular.module('warboat', ['ui.router']);

app.config(function ($stateProvider, $locationProvider) {
  $stateProvider
  .state('home', {
      url: '/',
      templateUrl: 'jade/partials/home.jade'
    });

  $locationProvider.html5Mode(true);
});
