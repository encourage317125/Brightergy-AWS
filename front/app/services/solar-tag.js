angular.module('bl.analyze.solar.surface')
  .service('solarTagService', ['$rootScope', '$q', '$window', '$sce', '$filter', 'SocketIO', 'moment', 'tagColors',
    function($rootScope, $q, $window, $sce, $filter, SocketIO, moment, tagColors) {
      var colorList = angular.copy(tagColors);
      var facilityList, lastReportedDateTime = 0;
      var lastFacilityDrilldown;
      var lastTotalCurrentPower = -1;

      function nodeInit(node, scope) {
        node.name = node.displayName || node.name;
        node.percent = '0' || node.percent;
        node.lastReportedValue = '0' || node.lastReportedValue;
        node.displayName = node.displayName || node.name;
        node.selected = node.selected || false;
        node.color = randomColor({luminosity: 'dark'});

        return node;
      }

      function scopeInit(scope, facility) {
        scope.percent = '0' || scope.percent;
        scope.lastReportedValue = '0' || scope.lastReportedValue;
        scope.selected = scope.selected || false;
        scope.nodes = scope.nodes.map(function (node) {
          return nodeInit(node, scope);
        });
        scope.displayName = scope.displayName || scope.name;
        scope.potentialPower = scope.potentialPower || 0;

        scope.color = randomColor({luminosity: 'dark'});
        return scope;
      }

      function facilityInit(facility) {
        facility.percent = '0' || facility.percent;
        facility.lastReportedValue = '0' || facility.lastReportedValue;
        facility.displayName = facility.displayName || facility.name;
        facility.geo = facility.geo || {};
        facility.commissioningDate = facility.commissioningDate
          ? (facility.commissioningDate.split('T')[0])
          : '-';
        facility.potentialPower = facility.potentialPower || 0;
        facility.selected = facility.selected || false;
        facility.scopes = facility.scopes.map(function (scope) {
          return scopeInit(scope, facility);
        });

        if (facility.selected) {
          facility.color = colorList.length ? colorList.pop() : randomColor({luminosity: 'dark'});
        } else {
          facility.color = randomColor({luminosity: 'dark'});
        }

        return facility;
      }

      function nodeUpdate(node, updatedRawNode) {

        angular.extend(node, {
          lastReportedTime: (new Date(updatedRawNode.lastReportedTime)).valueOf(),
          lastReportedValue: (updatedRawNode.lastReportedValue.toFixed(1))/1,
          percent: updatedRawNode.percent,
          totalEnergyGenerated: Math.round(updatedRawNode.totalEnergyGenerated),
          trend: updatedRawNode.trend
        });

        if (node.trend) {
          node.trendText = $sce.trustAsHtml(node.trend === 'up' ? '&#8593;' : '&#8595;'); // Up/Down arrow
        } {
          node.trendText = '';
        }

        lastTotalCurrentPower += node.lastReportedValue;
        lastTotalCurrentPower = (lastTotalCurrentPower.toFixed(1))/1;

        return node;
      }

      function scopeUpdate(scope, updatedRawScope) {

        angular.extend(scope, {
          lastReportedTime: (new Date(updatedRawScope.lastReportedTime)).valueOf(),
          lastReportedValue: updatedRawScope.lastReportedValue.toFixed(1) / 1,
          percent: updatedRawScope.percent,
          totalEnergyGenerated: Math.round(updatedRawScope.totalEnergyGenerated),
          trend: updatedRawScope.trend
        });

        if (scope.trend) {
          scope.trendText = $sce.trustAsHtml(scope.trend === 'up' ? '&#8593;' : '&#8595;'); // Up/Down arrow
        } {
          scope.trendText = '';
        }

        scope.lastReportedValue = 0;
        angular.forEach(scope.nodes, function (node) {
          var updatedRawNode = updatedRawScope.nodes[node.nodeId];
          if (!updatedRawNode) { return; }

          nodeUpdate(node, updatedRawNode);

          // Calculate scope's CP from child Node's CP
          scope.lastReportedValue += node.lastReportedValue;
          scope.lastReportedValue = (scope.lastReportedValue.toFixed(1))/1;
        });

        return scope;
      }

      function facilityUpdate(facility, updatedRawFacility) {

        angular.extend(facility, {
          lastReportedTime: (new Date(updatedRawFacility.lastReportedTime)).valueOf(),
          lastReportedValue: updatedRawFacility.lastReportedValue.toFixed(1) / 1,
          percent: updatedRawFacility.percent,
          totalEnergyGenerated: Math.round(updatedRawFacility.totalEnergyGenerated),
          trend: updatedRawFacility.trend
        });

        if (facility.trend) {
          facility.trendText = $sce.trustAsHtml(facility.trend === 'up' ? '&#8593;' : '&#8595;'); // Up/Down arrow
        } {
          facility.trendText = '';
        }

        if (lastReportedDateTime < facility.lastReportedTime) {
          lastReportedDateTime = facility.lastReportedTime;
        }

        facility.lastReportedValue = 0;
        angular.forEach(facility.scopes, function (scope) {
          var updatedRawScope = updatedRawFacility.scopes[scope.id];
          if (!updatedRawScope) { return; }

          scopeUpdate(scope, updatedRawScope);

          // Calculate scope's CP from child Node's CP
          facility.lastReportedValue += scope.lastReportedValue;
          facility.lastReportedValue = (facility.lastReportedValue.toFixed(1))/1;
        });
        return facility;
      }

      this.getAll = function () {

        facilityList = $window.renderSolarTags.facilities.map(facilityInit);

        return $q.when(facilityList);
      };

      this.watchAllSolarTags = function (callback, notWantTags) {
        SocketIO.watch('assurf:sources', function(sources) {
          if (notWantTags) {
            return callback(true);
          }

          lastTotalCurrentPower = 0;

          facilityList.map(function (facility) {
            var updatedRawFacility = sources[facility.id];
            if (!updatedRawFacility) { return facility; }
            return facilityUpdate(facility, updatedRawFacility);
          });

          $rootScope.LAST_UPDATED_TIMETIME = lastReportedDateTime;

          callback(facilityList);
        });
      };

      this.getSourceDetail = function (sourceId) {
        if (!sourceId) {
          return false;
        }

        for(var idx=0,len=facilityList.length; idx<len; idx++) {
          var scopes = facilityList[idx].scopes;

          if (facilityList[idx].id === sourceId) {
            return facilityList[idx];
          }

          for(var jdx=0,slen=scopes.length;jdx<slen;jdx++) {
            if (scopes[jdx].id === sourceId) {
              return scopes[jdx];
            }
          }
        }
      };

      this.getLastReportedDateTime = function () {
        return lastReportedDateTime;
      };

      this.getLastTotalCurrentPower = function () {
        return lastTotalCurrentPower;
      };

      this.getLastUpdatedFacilityList = function () {
        return facilityList;
      };

      function getPowerChart(rawPowerChart) {
        var categories;

        // Convert date string to timestamp in User timezone;
        categories = rawPowerChart.categories.map(function (originalDate) {
          return (new Date(originalDate)).valueOf();
        });

        return {
          'categories': categories,
          'series': rawPowerChart.series
        };
      }

      function getEnergyChart(rawEnergyChart) {
        var categories, series;

        // Convert date string to timestamp in User timezone;
        categories = rawEnergyChart.categories.map(function (originalDate) {
          return (new Date(originalDate)).valueOf();
        });

        series = rawEnergyChart.series.map(function (item) {
          return [item[2], item[3], item[4], item[5]];
        });

        return {
          'categories': categories,
          'series': series,
          'totalProduction': rawEnergyChart.totalProduction,
          'year': rawEnergyChart.year
        };
      }

      this.getFacilityDrilldown = function (callback) {
        return SocketIO.watch('assurf:facilitydrilldown', function(rawFD) {
          lastFacilityDrilldown = {
            energyChart: getEnergyChart(rawFD.energyChart),
            powerChart: getPowerChart(rawFD.powerChart),
            predictedAnnualGeneration: rawFD.predictedAnnualGeneration,
            predictedAnnualCarbon: rawFD.predictedCarbonAvoided,
            facilityImage: rawFD.facilityImage
          };

          callback(lastFacilityDrilldown);
        });
      };

      this.unwatchFacilityDrilldown = function (cbUniqueId) {
        SocketIO.unwatch('assurf:facilitydrilldown', cbUniqueId);
      };

      this.emitFetchFacilityForDrilldown = function (facilityId, energyYear) {
        var data = {
          'inspectedFacility': facilityId,
          'energyYear': energyYear || (new Date()).getFullYear()
        };

        SocketIO.emit('assurf:inputfacilitydrilldown', data);
      };
    }
  ]);