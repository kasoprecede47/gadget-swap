/**
 * Created by Ak on 2/19/2015.
 */
var app = angular.module("AdminApp",
    ['ui.select', 'ngSanitize','ngImgCrop',
        'ui.bootstrap', 'ui.router',
        'ngAnimate', 'ngResource',
        'angular-loading-bar', 'adminApp.directives', 'adminApp.controllers',
        'adminApp.services', 'ngCookies']);

app.config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {
        $stateProvider.state('devices',
            {
                url: '/devices',
                abstract: true,
                templateUrl: 'partials/device_models/dashboard.html',
                controller: function () {
                },
                resolve: {
                    'active': ['$rootScope', function ($rootScope) {
                        $rootScope.active_nav = 'devices';
                    }]
                }
            }
        );

        $stateProvider.state('devices.search',
            {
                url: '/search?q',
                templateUrl: 'partials/device_models/search.html',
                controller: ['$scope', 'result', '$stateParams', function ($scope, result, $stateParams) {
                    console.log(result);
                    $scope.result = result;
                    $scope.search = $stateParams.q;
                }],
                resolve: {
                    'result': ['$stateParams', 'DevicesServ', function ($stateParams, DevicesServ) {
                        return DevicesServ.query({q: $stateParams.q});
                    }],
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('devices.menu',
            {
                url: '/menu',
                templateUrl: 'partials/device_models/menu.html',
                controller: function () {
                },
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = false;
                    }]
                }
            }
        );

        $stateProvider.state('devices.add',
            {
                url: '/add',
                templateUrl: 'partials/device_models/add.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }],
                    'DeviceBrands': ['DeviceBrandsServ', function (DeviceBrandsServ) {
                        return DeviceBrandsServ.query({only: true});
                    }]
                },
                controller: ['$scope', 'ImageFetcher', 'DeviceBrands', function ($scope, ImageFetcher, DeviceBrands) {

                    $scope.models = DeviceBrands;

                    $scope.sizes = [];
                    $scope.sizes_string = '';
                    $scope.baseLinePrice = {};
                    $scope.baseLinePriceString = '';
                    $scope.images = [];

                    $scope.fetchImages = function (name) {
                        var promise = ImageFetcher.fetch(name);
                        promise.then(function (images) {
                            $scope.images = images;
                        });
                    };

                    function createStringVersion() {
                        $scope.sizes_string = $scope.sizes.join();
                    }

                    $scope.addToSizes = function (device_size) {
                        $scope.sizes.push(device_size);
                        $scope.device_size = null;
                        createStringVersion();
                    };

                    $scope.removeSize = function (index) {
                        $scope.sizes.splice(index, 1);
                        createStringVersion();
                    };

                    $scope.updateBaseLineString = function () {
                        var temp = [];
                        angular.forEach($scope.baseLinePrice, function (value, key) {
                            temp.push("" + key + ": " + value);
                        });
                        $scope.baseLinePriceString = temp.join();
                    }


                    //

                    $scope.myImage='';
                    $scope.myCroppedImage='';

                    var handleFileSelect=function(evt) {
                        var file=evt.currentTarget.files[0];
                        var reader = new FileReader();
                        reader.onload = function (evt) {
                            $scope.$apply(function($scope){
                                $scope.myImage=evt.target.result;
                            });
                        };
                        reader.readAsDataURL(file);
                    };
                    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

                }]
            }
        );

        $stateProvider.state('devices.list',
            {
                url: '/list',
                templateUrl: 'partials/device_models/list.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }],
                    'Devices': ['DevicesServ', function (DevicesServ) {
                        return DevicesServ.query({});
                    }]
                },
                controller: ['$scope', 'DevicesServ', 'Devices', function ($scope, DevicesServ, Devices) {
                    $scope.models = Devices;
                    $scope.deleteItem = function (id) {
                        DevicesServ.delete({id: id}, function (response) {
                            location.reload();
                        }, function (response) {
                            alert(response);
                        });
                    }
                }]
            }
        );


        $stateProvider.state('device_brands',
            {
                url: '/device_brands',
                abstract: true,
                templateUrl: 'partials/device_brands/dashboard.html',
                controller: function () {

                }
                ,
                resolve: {
                    'active': ['$rootScope', function ($rootScope) {
                        $rootScope.active_nav = 'device_brands';
                    }]
                }
            }
        );

        $stateProvider.state('device_brands.search',
            {
                url: '/search?q',
                templateUrl: 'partials/device_brands/search.html',
                controller: ['$scope', 'result', '$stateParams', function ($scope, result, $stateParams) {
                    console.log(result);
                    $scope.result = result;
                    $scope.search = $stateParams.q;
                }],
                resolve: {
                    'result': ['$stateParams', 'DeviceBrandsServ', function ($stateParams, DeviceBrandsServ) {
                        return DeviceBrandsServ.query({q: $stateParams.q});
                    }],
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('device_brands.menu',
            {
                url: '/menu',
                templateUrl: 'partials/device_brands/menu.html',
                controller: function () {
                },
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = false;
                    }]
                }
            }
        );

        $stateProvider.state('device_brands.add',
            {
                url: '/add',
                templateUrl: 'partials/device_brands/add.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                },
                controller: ['$scope', 'ImageFetcher', function ($scope, ImageFetcher) {

                    $scope.fetchImages = function (name) {
                        var promise = ImageFetcher.fetch(name);
                        promise.then(function (images) {
                            $scope.images = images;
                        });
                    };
                }]
            }
        );

        $stateProvider.state('device_brands.list',
            {
                url: '/list',
                templateUrl: 'partials/device_brands/list.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }],
                    'DeviceBrands': ['DeviceBrandsServ', function (DeviceBrandsServ) {
                        return DeviceBrandsServ.query({only: true});
                    }]
                },
                controller: ['$scope', 'DeviceBrandsServ', 'DeviceBrands', function ($scope, DeviceBrandsServ, DeviceBrands) {
                    $scope.brands = DeviceBrands;
                    $scope.deleteItem = function (id) {
                        DeviceBrandsServ.delete({id: id}, function (response) {
                            location.reload();
                        }, function (response) {
                            alert(response);
                        });
                    }
                }]
            }
        );

        $stateProvider.state('networks',
            {
                url: '/networks',
                abstract: true,
                templateUrl: 'partials/networks/dashboard.html',
                controller: function () {
                    //$state.go('networks.menu');
                },
                resolve: {
                    'active': ['$rootScope', function ($rootScope) {
                        $rootScope.active_nav = 'networks';
                    }]
                }
            }
        );

        $stateProvider.state('networks.search',
            {
                url: '/search?q',
                templateUrl: 'partials/networks/search.html',
                controller: ['$scope', 'result', '$stateParams', function ($scope, result, $stateParams) {
                    console.log(result);
                    $scope.result = result;
                    $scope.search = $stateParams.q;
                }],
                resolve: {
                    'result': ['$stateParams', 'NetworksServ', function ($stateParams, NetworksServ) {
                        return NetworksServ.query({q: $stateParams.q});
                    }],
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('networks.menu',
            {
                url: '/menu',
                templateUrl: 'partials/networks/menu.html',
                controller: function () {
                },
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = false;
                    }]
                }
            }
        );

        $stateProvider.state('networks.add',
            {
                url: '/add',
                templateUrl: 'partials/networks/add.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                },
                controller: ['$scope', 'ImageFetcher', function ($scope, ImageFetcher) {

                    $scope.fetchImages = function (name) {
                        var promise = ImageFetcher.fetch(name);
                        promise.then(function (images) {
                            $scope.images = images;
                        });
                    };
                }]
            }
        );

        $stateProvider.state('networks.list',
            {
                url: '/list',
                templateUrl: 'partials/networks/list.html',
                resolve: {
                    'Networks': ['NetworksServ', function (NetworksServ) {
                        return NetworksServ.query({});
                    }],
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                },
                controller: ['$scope', 'Networks', 'NetworksServ', function ($scope, Networks, NetworksServ) {
                    $scope.networks = Networks;
                    $scope.deleteItem = function (id) {
                        NetworksServ.delete({id: id}, function (response) {
                            location.reload();
                        }, function (response) {
                            alert(response);
                        });
                    }
                }]
            }
        );


        $stateProvider.state('advisers',
            {
                url: '/advisers',
                abstract: true,
                templateUrl: 'partials/advisers/dashboard.html',
                controller: function () {
                },
                resolve: {
                    'active': ['$rootScope', function ($rootScope) {
                        $rootScope.active_nav = 'advisers';
                    }]
                }
            }
        );

        $stateProvider.state('advisers.menu',
            {
                url: '/menu',
                templateUrl: 'partials/advisers/menu.html',
                controller: ['$scope', 'advisers', function ($scope, advisers) {
                    $scope.advisers = advisers;
                }],
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = false;
                    }],
                    'advisers': ['AdvisersServ', function (AdvisersServ) {
                        return AdvisersServ.query({limit: 6});
                    }]
                }
            }
        );

        $stateProvider.state('advisers.list',
            {
                url: '/list',
                templateUrl: 'partials/advisers/list.html',
                controller: ['$scope', 'advisers', 'AdvisersServ', function ($scope, advisers, AdvisersServ) {
                    $scope.advisers = advisers;

                    $scope.deleteItem = function (id) {
                        AdvisersServ.delete({id: id}, function (response) {
                            location.reload();
                        }, function (response) {
                            alert(response);
                        });
                    }
                }],
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }],
                    'advisers': ['AdvisersServ', function (AdvisersServ) {
                        return AdvisersServ.query();
                    }]
                }
            }
        );

        $stateProvider.state('advisers.add',
            {
                url: '/add',
                templateUrl: 'partials/advisers/add/add.html',
                controller: ['$scope', 'AdvisersServ', '$state', function ($scope, AdvisersServ, $state) {
                    $scope.createAdviser = function (adviser) {
                        AdvisersServ.save(adviser, function (adviser) {
                            console.log(adviser);
                            $state.go('advisers.list');
                        }, function (error) {
                            alert("Ensure values are all filled correctly");
                        });
                    }
                }],
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );


        $stateProvider.state('ticket',
            {
                url: '/ticket',
                abstract: true,
                templateUrl: 'partials/ticket/dashboard.html',
                controller: function () {
                },
                resolve: {
                    'active': ['$rootScope', function ($rootScope) {
                        $rootScope.active_nav = 'ticket';
                    }]
                }
            }
        );

        $stateProvider.state('ticket.menu',
            {
                url: '/menu',
                templateUrl: 'partials/ticket/menu.html',
                controller: ['$scope', 'Tickets', function ($scope, Tickets) {
                    $scope.tickets = Tickets;
                }],
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = false;
                    }],
                    'Tickets': ['TicketServ', function (TicketServ) {
                        return TicketServ.query({limit: 6});
                    }]
                }
            }
        );

        $stateProvider.state('ticket.list',
            {
                url: '/list',
                templateUrl: 'partials/ticket/list.html',
                controller: ['$scope', 'Tickets', 'TicketServ', function ($scope, Tickets, TicketServ) {
                    $scope.tickets = Tickets;

                    $scope.deleteItem = function (id) {
                        TicketServ.delete({id: id}, function (response) {
                            location.reload();
                        }, function (response) {
                            alert(response);
                        });
                    }
                }],
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }],
                    'Tickets': ['TicketServ', function (TicketServ) {
                        return TicketServ.query();
                    }]
                }
            }
        );

        $stateProvider.state('ticket.import',
            {
                url: '/import',
                templateUrl: 'partials/ticket/import.html',
                controller: ['$scope', 'Tickets', 'TicketServ', function ($scope, Tickets, TicketServ) {
                    $scope.tickets = Tickets;

                    $scope.deleteItem = function (id) {
                        TicketServ.delete({id: id}, function (response) {
                            location.reload();
                        }, function (response) {
                            alert(response);
                        });
                    }
                }],
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }],
                    'Tickets': ['TicketServ', function (TicketServ) {
                        return TicketServ.query();
                    }]
                }
            }
        );

        $stateProvider.state('ticket.config',
            {
                url: '/config',
                templateUrl: 'partials/ticket/config.html',
                controller: ['$scope', 'TicketConfigServ','GradingSystem','GradingSystemServ',
                    function ($scope, TicketConfigServ,GradingSystem,GradingSystemServ) {
                    $scope.columns = [];
                    $scope.gradingSystem = GradingSystem;

                    TicketConfigServ.query({},function(result){
                        $scope.columns = result;
                    });

                    $scope.deleteItem = function (id) {
                        TicketConfigServ.delete({id: id}, function (response) {
                            location.reload();
                        }, function (response) {
                            alert(response);
                        });
                    }
                }],
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }],
                    'GradingSystem': ['GradingSystemServ',function(GradingSystemServ){
                        return GradingSystemServ.get({});
                    }]

                }
            }
        );

        $stateProvider.state('ticket.add',
            {
                url: '/add',
                templateUrl: 'partials/ticket/add/base.html',
                controller: 'NewTicketController',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }],
                    'TicketColumns': ['TicketConfigServ',function(TicketConfigServ){
                        return TicketConfigServ.query({});
                    }],
                    'Networks': ['NetworksServ', function (NetworksServ) {
                        return NetworksServ.query({});
                    }],
                    'Airtel': ['GadgetEvaluationReward', function (GadgetEvaluationReward) {
                        return GadgetEvaluationReward.fetchAirtelBonus();
                    }],
                    'DeviceBrands':['DeviceBrandsServ',function(DeviceBrandsServ){
                        return DeviceBrandsServ.query({});
                    }],
                    'GradingSystem': ['GradingSystemServ',function(GradingSystemServ){
                        return GradingSystemServ.get({});
                    }]
                }
            }
        );

        $stateProvider.state('ticket.add.stepOne',
            {
                url: '/step-one',
                templateUrl: 'partials/ticket/add/step-one.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('ticket.add.stepTwo',
            {
                url: '/step-two',
                templateUrl: 'partials/ticket/add/step-two.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('ticket.add.stepThree',
            {
                url: '/step-three',
                templateUrl: 'partials/ticket/add/step-three.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('ticket.add.stepFour',
            {
                url: '/step-three',
                templateUrl: 'partials/ticket/add/step-four.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('ticket.add.final',
            {
                url: '/final',
                templateUrl: 'partials/ticket/add/final.html',
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('ticket.show',
            {
                url: '/show/{id}',
                templateUrl: 'partials/ticket/show.html',
                controller: ['$scope', '$stateParams','TicketServ','$state','Ticket',
                    function ($scope, $stateParams,TicketServ,$state, Ticket) {
                        $scope.ticket = Ticket;

                        $scope.deleteItem = function (id) {
                            TicketServ.delete({id: id}, function (response) {
                                $state.go('ticket.list');
                            }, function (response) {
                                alert(response);
                            });
                        }
                    }],
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }],
                    'Ticket': ['TicketServ', '$stateParams', function (TicketServ, $stateParams) {
                        return TicketServ.get({id: $stateParams.id});
                    }]
                }
            }
        );


        $stateProvider.state('ticket.accept-terms',
            {
                url: '/accept-terms/{id}',
                templateUrl: 'partials/ticket/evaluation/terms.html',
                controller: ['$scope', '$stateParams', '$state', function ($scope, $stateParams, $state) {
                    if (typeof $stateParams.id == "undefined")
                        $state.go('ticket.add.stepOne');

                    $scope.next = function () {
                        $state.go('ticket.review-ticket', {id: $stateParams.id});
                    };
                }],
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );


        $stateProvider.state('ticket.review-ticket',
            {
                url: '/review/{id}',
                templateUrl: 'partials/ticket/evaluation/review.html',
                controller: ['$scope', '$stateParams', 'Ticket', 'TicketServ', '$state', 'MailServ',
                    function ($scope, $stateParams, Ticket, TicketServ, $state, MailServ) {

                        if (typeof $stateParams.id == "undefined")
                            $state.go('ticket.add.stepOne');

                        $scope.ticket = Ticket;

                        $scope.next = function () {
                            Ticket.discount_voucher_code = $scope.ticket.discount_voucher_code;
                            TicketServ.update({id: Ticket.id}, Ticket);

                            MailServ.save({'ticket_id': Ticket.id}, function (mail) {
                                console.log(mail);
                            });

                            $state.go('ticket.all-done');
                        }
                    }],
                resolve: {
                    'Ticket': ['TicketServ', '$state', '$stateParams',
                        function (TicketServ, $state, $stateParams) {
                            return TicketServ.get({id: $stateParams.id});
                        }],
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('ticket.all-done',
            {
                url: '/done',
                templateUrl: 'partials/ticket/done.html',
                controller: function () {
                },
                resolve: {
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('ticket.search',
            {
                url: '/search?q',
                templateUrl: 'partials/ticket/search.html',
                controller: ['$scope', 'result', '$stateParams', function ($scope, result, $stateParams) {
                    console.log(result);
                    $scope.result = result;
                    $scope.search = $stateParams.q;
                }],
                resolve: {
                    'result': ['$stateParams', 'TicketServ', function ($stateParams, TicketServ) {
                        return TicketServ.query({q: $stateParams.q});
                    }],
                    'hasHistory': ['$rootScope', function ($rootScope) {
                        $rootScope.hasHistory = true;
                    }]
                }
            }
        );

        $stateProvider.state('config',
            {
                url: '/config',
                templateUrl: 'partials/config/form.html',
                controller: function () {
                },
                resolve: {
                    'active': ['$rootScope', function ($rootScope) {
                        $rootScope.active_nav = 'config';
                    }]
                }
            }
        );


        $urlRouterProvider.otherwise('/ticket/menu');
    }]);

app.factory('sessionInjector', ['$location', function ($location) {
    return {
        request: function (config) {
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            console.log('Header modified');
            return config;
        },
        responseError: function (response) {
            if (response.status == 401) {
                location.href = '/auth/login';
                return response;
            }
            return response;
        },
        response: function (response) {
            if (response.status == 401) {
                location.href = '/auth/login';
                return response;
            }
            return response;
        }
    };
}]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('sessionInjector');
}]);

app.run(['$http', '$rootScope', 'CSRF_TOKEN','$timeout','PreloadTemplates',
    function ($http, $rootScope, CSRF_TOKEN,$timeout, PreloadTemplates) {
        PreloadTemplates.run();
        $rootScope.CSRF_TOKEN = CSRF_TOKEN;
        $http.defaults.headers.common['csrf_token'] = CSRF_TOKEN;
        $rootScope.toast  = { messages: [],show: false,type: 'info' };
    }]);



/**
 * Created by Ak on 2/19/2015.
 */
var module = angular.module('adminApp.controllers', ['adminApp.services']);

module.controller('NewTicketController', [
    '$scope','TicketServ','TicketColumns', '$state', '$stateParams','DeviceBrands','ToastService',
    'GradeDeviceServ','$cookieStore','Networks','GadgetEvaluationReward','Airtel','GradingSystem',
    function ($scope,TicketServ,TicketColumns, $state, $stateParams,DeviceBrands,ToastService,
              GradeDeviceServ,$cookieStore,Networks,GadgetEvaluationReward,Airtel,GradingSystem) {
        $scope.device_brands = DeviceBrands;
        $scope.TicketColumns = TicketColumns;
        $scope.activeStep = 'stepOne';
        $scope.isCreatingTicket = true;
        $scope.creationError = false;
        $scope.ticket = {
            test: {
                deviceBoot: '',
                callUnlock: '',
                wirelessConnection: '',
                icloudConnection: ''
            },
            gradingSystem: GradingSystem
            //{
            //    touchScreen: {rating: '', weight: 0.625},
            //    lcdScreen: {rating: '', weight: 0.625},
            //    deviceCasing: {rating: '', weight: 0.625},
            //    deviceKeypad: {rating: '', weight: 0.25},
            //    deviceCamera: {rating: '', weight: 0.25},
            //    deviceEarPiece: {rating: '', weight: 0.125},
            //    deviceSpeaker: {rating: '', weight: 0.125},
            //    deviceEarphoneJack: {rating: '', weight: 0.125},
            //    deviceChargingPort: {rating: '', weight: 0.25}
            //}
        };
        $scope.selected = {};
        $scope.networks = Networks;
        $scope.brand = {};
        $scope.device = {};
        $scope.activeNextButton = false;
        $scope.airtel = Airtel;
        $scope.portToAirtel = 'No';

        $scope.$watch('ticket.test', function (newV, oldV) {
            if(!stepThreeActive()){
                return;
            }
            console.log('test change');
            console.log(newV);
            var ready = checkTestsPassed(newV);
            setViewState(ready);
        }, true);


        $scope.$watch('ticket.gradingSystem', function (newV, oldV) {
            if(!stepFourActive()){
                return;
            }
            console.log('gradingSystem change');
            console.log(newV);
            $scope.ticket.device_grade = GradeDeviceServ.getGrade(newV);
            console.log('Grade:' + $scope.ticket.device_grade);
        }, true);

        $scope.$watch('brand.selectedIndex', function (newV, oldV) {
            if(!stepTwoActive()){
                return;
            }
            console.log('brand changed');
            $scope.selected.brand = $scope.device_brands[newV];
            $scope.devices = $scope.selected.brand.gadgets;
            //brand.selected
        });

        $scope.$watch('device.selectedIndex', function (newV, oldV) {
            if(!stepTwoActive()){
                return;
            }
            console.log('device changed');
            $scope.selected.device = $scope.devices[newV];
            $scope.ticket.gadget_id = $scope.selected.device.id;
        });


        $scope.createTicket = function (ticket) {
            ticket.network_id = parseInt(ticket.network_id);
            ticket.size_id = parseInt(ticket.size_id);

            var ticketSaved = TicketServ.save(ticket);
            ticketSaved.$promise.then(function (ticket) {
                $scope.isCreatingTicket = false;
                if (ticket.hasOwnProperty('id')) {
                    $scope.ticket.savedTicket = ticket;
                    console.log(ticket);
                }else{
                    console.log('error');
                    $scope.creationError = true;
                    ToastService.error("Could not create ticket, please try again later");
                }
            }, function (ticket) {
                alert("failed");
                console.log(ticket);
                $scope.creationError = true;
                ToastService.error("Could not create ticket, please try again later");
            });
        };


        $scope.nextStepOne   = function() {
            $scope.activeStep = 'stepOne';
            $state.go('ticket.add.stepOne');
        };

        $scope.nextStepTwo   = function() {
            $scope.activeStep = 'stepTwo';
            $state.go('ticket.add.stepTwo');
        };

        $scope.nextStepThree = function () {
            $scope.activeStep = 'stepThree';
            $state.go('ticket.add.stepThree');
        };

        $scope.nextStepFour = function () {
            $scope.activeStep = 'stepFour';
            $state.go('ticket.add.stepFour');
        };

        $scope.nextStepFinal = function () {
            $scope.activeStep = 'stepFinal';
            calculateDeviceReward();
            $state.go('ticket.add.final');
            $scope.createTicket($scope.ticket);
        };

        $scope.nextStepAcceptTerms = function () {
            $scope.activeStep = 'stepAcceptTerms';
            updateTicketsPortToAirtel();
            $state.go('ticket.accept-terms', {id: $scope.ticket.savedTicket.id});
        };

        $scope.goHome = function () {
            $state.go('ticket.menu');
        };

        function calculateDeviceGrade(){
            return $scope.ticket.device_grade;
        }

        function calculateDeviceReward(){
            $scope.selected.grade = calculateDeviceGrade();
            $scope.selected.size = $scope.ticket.size_id;
            $scope.ticket.reward = GadgetEvaluationReward.calculate($scope.selected);
        }

        function stepTwoActive(){
            return $scope.activeStep == 'stepTwo';
        }

        function stepThreeActive(){
            return $scope.activeStep == 'stepThree';
        }
        function stepFourActive(){
            return $scope.activeStep == 'stepFour';
        }
        function stepFinalActive(){
            return $scope.activeStep == 'stepFinal';
        }

        function checkTestsPassed(obj) {
            var state = {ready: true};

            angular.forEach(obj, function (value, key) {
                if (value == 'no') {
                    this.ready = false;
                }
            }, state);

            return state.ready;
        }

        function setViewState(ready) {
            $scope.activeNextButton = ready;
            if (ready) {
                $scope.message = "Ok, proceed.";
            } else {
                $scope.message = "Sorry, Device doesn't Qualify to Continue";
            }
        }

        function updateTicketsPortToAirtel() {
            $scope.ticket.savedTicket.port_to_airtel = $scope.portToAirtel;

            TicketServ.update({id:  $scope.ticket.savedTicket.id},  $scope.ticket.savedTicket);
        }
    }]);
/**
 * Created by Ak on 2/19/2015.
 */

var app =  angular.module('adminApp.directives',[]);

app.directive('backButton',function(){
    return {
        'restrict': 'EA',
        'template': '<a class="btn base-resize search-btn back-btn" href=""><span class="fa fa-chevron-left"></span></a>',
        'link': function link(scope, element, attrs) {
            element.bind('click',function(e){
                window.history.back();
                e.preventDefault();
            })
        }
    }
});

app.directive('toast',function($animate,$timeout){
    return {
        'restrict': 'EA',
        'template': '<div class="toast alert alert-{{ type }}" ><ul><li ng-repeat="message in messages"> {{ message }}</li></ul></div>',
        scope: {
            type: '=type',
            messages: '=messages',
            show: '=show'
        },
        'link': function link(scope, element, attrs) {
            function showToast() {
                //$animate.addClass(element,'toast-alert');
                element.css({opacity: 1});
                $timeout(hideToast,10000);
            }

            function hideToast() {
                element.css({opacity: 0});
                //$animate.removeClass(element,'toast-alert');
            }
            showToast();
            scope.$watch(function() { return scope.show; },function(newV,oldV){
                if(newV == true){
                    showToast();
                }else{
                    hideToast();
                }
            })
        }
    }
});

/**
 * Created by Ak on 2/19/2015.
 */



/**
 * Created by Ak on 2/19/2015.
 */

var app =  angular.module('adminApp.services',[]);

app.factory('TicketServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/ticket/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

//TicketConfigServ
app.factory('TicketConfigServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/ticket-config/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

app.factory('DeviceBrandsServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/device_makers/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

app.factory('AdvisersServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/advisers/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

app.factory('DevicesServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/devices/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

app.factory('GradingSystemServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/grading-system-config/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);


app.factory('MailServ', ['$resource', function ($resource) {
    return $resource('/resources/mail', null);//URLServ.getResourceUrlFor("ticket"));
}]);


app.factory('NetworksServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/networks/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);


app.factory('URLServ', ['$rootScope', function ($rootScope) {
    return {
        "getResourceUrlFor": function(name){
            return $rootScope.data.resources[name];
        }
    }
}]);

app.factory('GadgetEvaluationReward', ['NetworksServ', '$cookieStore', function (NetworksServ, $cookieStore) {
    var reward = {result: ''};

    function getBaseLinePrice(device, size) {
        var baseLinePrice = 0;

        console.log('Device --reward');
        console.log(device);
        angular.forEach(device.base_line_prices, function (v, k) {
            if (v.id == size) {
                    baseLinePrice = parseInt(v.value);
                }
        });

        return baseLinePrice;
    }

    function calculatePriceFromGrade(device, grade, baseLinePrice) {
        console.log(baseLinePrice);
        console.log(device.brand.normal_condition);
        console.log(device.brand);
        console.log(grade);

        switch (grade) {
            case 'A':
                return parseFloat(parseInt(device.brand.normal_condition) / 100.0) * baseLinePrice;
            case 'B':
                return parseFloat(parseInt(device.brand.scratched_condition) / 100.0) * baseLinePrice;
            case 'C':
                return parseFloat(parseInt(device.brand.bad_condition) / 100.0) * baseLinePrice;
        }
    }

    return {
        "calculate": function (model) {
            reward.result = calculatePriceFromGrade(model, model.grade, getBaseLinePrice(model.device, model.size));
            console.log(reward.result);
            $cookieStore.put('last-reward', reward.result);
            return reward.result;
        },
        "getLastReward": function () {
            return $cookieStore.get('last-reward');
        },
        fetchAirtelBonus: function () {
            var network = NetworksServ.get({q: 'airtel'});
            return network;
        }
    }
}]);

app.factory('GradeDeviceServ', ['$rootScope', function ($rootScope) {

    var threshold = {
        'A': 8.1,
        'B': 5.85
    };

    function generateGradePoint(device) {
        var result = {gradePoint: 0};

        angular.forEach(device, function (value, key) {
            if (value.rating != '') {
                this.gradePoint += parseInt(value.rating) * value.weight;
            }
        }, result);

        return result.gradePoint;
    }

    function generateGradeLetter(gradePoint) {
        var value = parseFloat(gradePoint);

        if (value >= threshold.A) {
            return 'A';
        } else if (value >= threshold.B) {
            return 'B';
        } else {
            return 'C';
        }
    }

    return {
        "getGrade": function (device) {
            var gradePoint = generateGradePoint(device);
            return generateGradeLetter(gradePoint);
        }
    }
}]);

app.factory('PreloadTemplates', ['$templateCache', '$http','PRELOAD_UI_LIST', function ($templateCache, $http,PRELOAD_UI_LIST) {
    var templates = PRELOAD_UI_LIST.get();
    return {
        run: function () {
            templates.forEach(function (currentItem) {
                $http.get(currentItem, {cache: $templateCache});
            });
        }
    }
}]);


app.factory('ImageFetcher', ['$http', '$q', function ($http, $q) {
    var searchUrl = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAJ_8QtWECvWTcrukqvfLmRWdARJ2bI2rk&cx=011505858740112002603:dap5yb7naau&q=";

    return {
        fetch: function (query) {
            var images = [];
            var deferred = $q.defer();
            $http.get(searchUrl + encodeURI(query)).then(function (response) {
                console.log(response.data);
                response.data.items.forEach(function (currentValue) {
                    if (angular.isDefined(currentValue.pagemap)) {
                        var temp = currentValue.pagemap.cse_image;//cse_thumbnail;
                        if (angular.isDefined(temp) && angular.isArray(temp)) {
                            temp.forEach(function (cValue) {
                                images.push(cValue);
//                                if (cValue.height > cValue.width) {
//                                    images.push(cValue);
//                                }
                            });
                        } else if (angular.isDefined(temp) && angular.isObject(temp)) {
                            images.push(temp);
                        }
                    }
                });
                console.log(images);
                deferred.resolve(images);
            }, function (response) {
                console.log(response);
                deferred.reject(response);
            });

            return deferred.promise;
        }
    }

}]);


app.factory('ToastService', ['$rootScope', function ($rootScope) {

    if(angular.isUndefined( $rootScope.toast)){
        $rootScope.toast  = {messages: [],show: false,type: 'info'};
    }

    return {
        error: function (message) {
            $rootScope.toast  = {messages: [message],show: true,type: 'danger'};
        },
        info: function(message){
            $rootScope.toast= {messages: [message],show: true,type: 'info'};
        },
        success: function(message){
            $rootScope.toast= {messages: [message],show: true,type: 'success'};
        }
    }
}]);