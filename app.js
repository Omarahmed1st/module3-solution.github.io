(function () {
  'use strict';

  
  // Define the AngularJS module
  angular.module('NarrowItDownApp', [])

  // Define the controller
  .controller('NarrowItDownController', NarrowItDownController)

  // Define the service
  .service('MenuSearchService', MenuSearchService)

  // Define the directive
  .directive('foundItems', FoundItemsDirective);

  // Inject dependencies
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrowCtrl = this;
    narrowCtrl.searchTerm = "";
    narrowCtrl.found = [];

    narrowCtrl.narrowItDown = function () {
      if (narrowCtrl.searchTerm.trim() === "") {
        narrowCtrl.found = [];
        return;
      }

      MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
        .then(function (foundItems) {
          narrowCtrl.found = foundItems;
        })
        .catch(function (error) {
          console.log("Something went wrong:", error);
        });
    };

    narrowCtrl.removeItem = function (index) {
      narrowCtrl.found.splice(index, 1);
    };
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
      }).then(function (result) {
        var foundItems = [];
        var items = result.data;

        for (var item in items) {
          if (items[item].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            foundItems.push(items[item]);
          }
        }

        return foundItems;
      });
    };
  }

  function FoundItemsDirective() {
    var ddo = {
      restrict: 'E',
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

    list.isEmpty = function () {
      return list.items && list.items.length === 0;
    };
  }
})();
