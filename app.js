(function () {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);
  
    // Controller
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var narrowCtrl = this;
      narrowCtrl.searchTerm = "";
      narrowCtrl.found = [];
  
      narrowCtrl.getMatchedItems = function () {
        if (narrowCtrl.searchTerm.trim() === "") {
          narrowCtrl.found = [];
          return;
        }
  
        MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
          .then(function (foundItems) {
            narrowCtrl.found = foundItems;
          });
      };
  
      narrowCtrl.removeItem = function (index) {
        narrowCtrl.found.splice(index, 1);
      };
    }
  
    // Service
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      var service = this;
  
      service.getMatchedMenuItems = function (searchTerm) {
        return $http({
          method: "GET",
          url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
        }).then(function (result) {
          var allMenuItems = result.data;
          var foundItems = [];
  
          // Process the menu items to find matching descriptions
          for (var category in allMenuItems) {
            var items = allMenuItems[category].menu_items;
            items.forEach(function (item) {
              if (item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                foundItems.push(item);
              }
            });
          }
  
          return foundItems;
        });
      };
    }
  
    // Directive
    function FoundItemsDirective() {
      var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
          items: '<',
          onRemove: '&'
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'list',
        bindToController: true
      };
  
      return ddo;
    }
  
    function FoundItemsDirectiveController() {
      var list = this;
    }
  })();
  
