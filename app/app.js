'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'myApp.lib.services',
    'myApp.directives.myDirective',
    'myApp.controllers.user',
    'myApp.controllers.landing',
    'myApp.controllers.newgroup',
    'myApp.controllers.signup',
    'myApp.controllers.public',
    'myApp.controllers.private'
])

.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/landing', {
        title: 'Landing',
        templateUrl: 'templates/landing.html',
        controller: 'LandingCtrl'
    });
    $routeProvider.when('/newgroup', {
        title: 'NewGroup',
        templateUrl: 'templates/newgroup.html',
        controller: 'NewGroupCtrl'
    });
    $routeProvider.when('/private', {
        title: 'Private',
        templateUrl: 'templates/private.html',
        controller: 'PrivateCtrl'
    });
    $routeProvider.when('/public', {
        title: 'Public',
        templateUrl: 'templates/public.html',
        controller: 'PublicCtrl'
    });
    $routeProvider.when('/signup', {
        title: 'SignUp',
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl'
    });
    $routeProvider.when('/user', {
        title: 'User',
        templateUrl: 'templates/user.html',
        controller: 'UserCtrl'
    });



    $routeProvider.otherwise({
        redirectTo: '/home'
    });

}])

.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);
