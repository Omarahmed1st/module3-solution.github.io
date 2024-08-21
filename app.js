(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm = "";
    ctrl.found = [];
    ctrl.message = false;

    ctrl.narrowItDown = function() {
        if (ctrl.searchTerm.trim() === "") {
            ctrl.message = true;
            ctrl.found = [];
            return;
        }

        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
        .then(function(foundItems) {
            ctrl.found = foundItems;
            ctrl.message = ctrl.found.length === 0;
        });
    };

    ctrl.removeItem = function(index) {
        ctrl.found.splice(index, 1);
    };
}
MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
        return $http({
            method: "GET",
            url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
        }).then(function(response) {
            var allItems = response.data;
            var foundItems = [];

            for (var item in allItems) {
                if (allItems[item].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                    foundItems.push(allItems[item]);
                }
            }

            return foundItems;
        });
    };
}
function FoundItemsDirective() {
    var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
            items: '<',
            onRemove: '&'
        }
    };

    return ddo;
}

})();
