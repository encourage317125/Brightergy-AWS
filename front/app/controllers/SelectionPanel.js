angular.module('bl.analyze.solar.surface')
  .controller('SelectionPanelController',
  ['$scope', '$modal', '$filter', 'solarTagService', 'powerService', 'energyService', 'weatherService',
    'SourceSelectionEventService', 'SourceNotification',
    function ($scope, $modal, $filter, solarTagService, powerService, energyService, weatherService,
              SourceSelectionEventService, SourceNotification) {
      // Init scope variables
      //$scope.tzname = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
      /*$scope.tzname = new Date().toLocaleString('en-Us',
          {hour12:false, hour:'2-digit', timeZoneName: 'long'}
      ).replace(/^\d\d/, '').trim();*/

      //$scope.tzname=getTimezoneName();
      $scope.today= new Date();

      $scope.powerInfo = {
        current: -1,
        currentDayAvg: 0.5,
        minAvg: 0,
        maxAvg: 1,
        potential: 0
      };

      $scope.energyInfo = {
        today: 0,
        utilitySavingToday: 0,
        utilitySavingMonth: 0,
        minAvg: 5,
        maxAvg: 30
      };

      $scope.todayWeather = {
        temperature: {
          now: 0,
          min: 0,
          max: 0
        },
        cityName: 'Kansas City',
        air: {
          humidity: 0,
          pressure: 0,
          windSpeed: 0
        },
        sunTime: {
          sunset: '',
          sunrise: ''
        }
      };

      $scope.foreWeather = [];
      $scope.historicalWeather = [];

      $scope.facilities = [];
      $scope.selectedFacilities = [];
      $scope.selectedScopes = [];
      $scope.selectedNodes = [];
      $scope.countNodes = 0;
      $scope.isSourceListLoaded = false;
      $scope.isSelectAll = true;
      $scope.isMainStageLoaded = false;
      $scope.isWeatherHistoryShown = false;

      $scope.prevModalInstance = null;
      $scope.powerModalInstance = null;

      $scope.toggleWeatherHistory = function () {
        $scope.isWeatherHistoryShown = !$scope.isWeatherHistoryShown;
      };

      $scope.loadFacilityList = function (newFacilityList) {

        var lastPowerSumOfSelectedNodes = solarTagService.getLastTotalCurrentPower();
        if (lastPowerSumOfSelectedNodes >= 0) {
          if ($scope.powerInfo.maxAvg < lastPowerSumOfSelectedNodes) {
            $scope.powerInfo.maxAvg = lastPowerSumOfSelectedNodes;
          }
          $scope.powerInfo.current = lastPowerSumOfSelectedNodes;
        }

        $scope.powerInfo.potential = 0;
        angular.forEach(newFacilityList, function (facility) {
          if (facility.selected) {
            $scope.powerInfo.potential += facility.potentialPower;
          }
        });

        $scope.facilities = $filter('orderBy')(newFacilityList, ['-selected', '+displayName']);
        $scope.isSourceListLoaded = true;
      };

      function checkSourcesSelectedStatus (facilities) {
        angular.forEach(facilities, function (facility) {
          if (!facility.scopes.length) { return; }

          var childrenStatusSum = false;
          facility.countSelectedChilds = 0;
          angular.forEach(facility.scopes, function (scope) {

            var nodeStatusSum = false;
            scope.countSelectedChilds = 0;
            angular.forEach(scope.nodes, function(node) {
              nodeStatusSum = nodeStatusSum || node.selected;
              if (node.selected) { scope.countSelectedChilds++; }
            });

            scope.selected = nodeStatusSum;
            childrenStatusSum = childrenStatusSum || scope.selected;
            if (scope.selected) {
              facility.countSelectedChilds++;
            }
            // ToDo: Node selection/deselection
          });

          facility.selected = childrenStatusSum;
        });
      }

      function setSourceSelectionRecursively (source, selected) {
        source.selected = !!selected;
        if ((source.scopes && !source.scopes.length) ||
          (source.nodes && !source.nodes.length) ||
          (!source.nodes && !source.scopes)) {
          return ;
        }
        var children = source.scopes ? 'scopes' : 'nodes';
        angular.forEach(source[children], function (child) {
          setSourceSelectionRecursively(child, !!selected);
        });
      }

      $scope.initLoads = function () {
        solarTagService
          .getAll()
          .then(function (facilities) {
            angular.forEach(facilities, function (facility) {
              $scope.countNodes += facility.nodesCount;//facility.scopes.length;
              $scope.countScopes += facility.scopes.length;
              $scope.isSelectAll = $scope.isSelectAll && facility.selected;
            });
            return facilities;
          })
          .then(function (facilities) {
            checkSourcesSelectedStatus(facilities);
            $scope.loadFacilityList(facilities);
            solarTagService.watchAllSolarTags($scope.loadFacilityList);
            $scope.getSelectedSources();
            return true;
          });

        powerService
          .watchCurrentPower(function (data) {
            console.log('currentPower info:', data);
            // We will use `assurf:power` for the first time only
            // after that we will show total sum of power from `assurf:sources` for the Current Power kpi
            if ($scope.powerInfo.current < 0) {
              angular.extend($scope.powerInfo, data);
            }
          });

        energyService
          .watchCurrentEnergy(function (data) {
            console.log('currentEnergy info:', data);
            angular.extend($scope.energyInfo, data);
          });

        weatherService
          .watchWeather(function (data) {
            $scope.todayWeather = data.todayWeather;
            $scope.historicalWeather = data.historicalWeather;
            $scope.foreWeather = data.foreWeather;
          });

        SourceSelectionEventService
          .listenMainStageLoaded(function () {
            $scope.isMainStageLoaded = true;
          });
      };

      $scope.openPowerDrillDown = function() {
        if ($scope.powerModalInstance) {
          $scope.powerModalInstance.dismiss('cancel');
        }
        $scope.powerModalInstance = $modal.open({
          templateUrl: 'app/elements/realtime-power/drilldown.html',
          controller: 'EnergyDrilldownController',
          windowClass: 'drilldown',
          size: 'lg',
          resolve: {}
        });
      };

      $scope.showFacilityDetails = function (selectedFacility) {
        if ($scope.prevModalInstance) {
          $scope.prevModalInstance.dismiss('cancel');
        }

        $scope.prevModalInstance = $modal.open({
          templateUrl: 'app/partials/facility-details.html',
          controller: 'facilityDetailsController',
          windowClass: 'drilldown',
          size: 'lg',
          resolve: {
            selectedFacility: function () {
              return selectedFacility;
            }
          }
        });

        solarTagService.emitFetchFacilityForDrilldown(selectedFacility.id);
      };

      $scope.toggleSelectSource = function (source, sourceType, $rootScope) {
        // Todo: Prevent user from deselect all sources
        var toggledStatus = source.selected;
        var targetSelector = '';

        if (!toggledStatus) { // when user is going to deselect the all sources
          if (sourceType === 'facility') {
            if ($scope.selectedFacilities.length - 1 === 0) {
              source.selected = !source.selected;   // restore origin status

              //alert('Sorry, but you can\'t deselect whole sources.');
              targetSelector = '#' + sourceType + '-' + source.id;
              (new SourceNotification(targetSelector)).showNotification();

              return;
            }
          } else {
            var countNodesGoingToBeDeselected = source.nodes ? source.nodes.length : 1;
            if ($scope.selectedNodes.length - countNodesGoingToBeDeselected  === 0) {
              source.selected = !source.selected;   // restore origin status

              //alert('Sorry, but you can\'t deselect whole sources.');
              targetSelector = '#' + sourceType + '-' + source.id;
              (new SourceNotification(targetSelector)).showNotification();

              return;
            }
          }
        }

        setSourceSelectionRecursively(source, toggledStatus);
        checkSourcesSelectedStatus($scope.facilities);

        $scope.getSelectedSources();
        $scope.facilities = $filter('orderBy')($scope.facilities, ['-selected', '+displayName']);

        if (sourceType !== 'node') {
          if (source.selected) {
            $scope.powerInfo.potential += source.potentialPower;
          } else {
            $scope.powerInfo.potential -= source.potentialPower;
          }
        }

        $scope.isSourceListLoaded = false;
        $scope.isMainStageLoaded = false;

        SourceSelectionEventService
          .broadcast($scope.selectedFacilities, $scope.selectedScopes, $scope.selectedNodes)
          .resetMainStageChecking();
      };

      $scope.getSelectedSources = function () {

        $scope.selectedFacilities = [];
        $scope.selectedScopes = [];
        $scope.selectedNodes = [];
        var selectedFacility = $scope.facilities.filter(function (f) {
          return f.selected;
        });
        $scope.selectedFacilities = selectedFacility.map(function (f) {
          $scope.selectedScopes = $scope.selectedScopes.concat(f.scopes.filter(function (s) {
            return s.selected;
          }).map(function (s) {
            $scope.selectedNodes = $scope.selectedNodes.concat(s.nodes.filter(function (n) {
              return n.selected;
            }).map(function (n) {
              return n.id;
            }));
            return s.id;
          }));
          return f.id;
        });

        // Should check if all source is selected
        if ($scope.countNodes === $scope.selectedNodes.length) {
          $scope.selectedFacilities = [];
          $scope.selectedScopes = [];
          $scope.selectedNodes = [];
        }
      };

      $scope.toggleExpandSource = function (source) {
        if (!source.expanded) {
          source.expanded = true;
        } else {
          source.expanded = !source.expanded;
        }
      };

      $scope.toggleSelectAllSource = function () {
        $scope.isSelectAll = !$scope.isSelectAll;
        //console.time('toggleSelectAllSource');

        angular.forEach($scope.facilities, function (facility) {
          setSourceSelectionRecursively(facility, $scope.isSelectAll);
        });

        if (!$scope.isSelectAll) { // if User clicked 'Deselect All'
          // Select the first facility in case of User clicked the 'Deselect All'
          setSourceSelectionRecursively($scope.facilities[0], true);
        }

        $scope.getSelectedSources();
        //console.timeEnd('toggleSelectAllSource');
        SourceSelectionEventService
          .broadcast($scope.selectedFacilities, $scope.selectedScopes, $scope.selectedNodes)
          .resetMainStageChecking();
        $scope.isMainStageLoaded = false;
      };

      $scope.initLoads();
    }
  ]);
