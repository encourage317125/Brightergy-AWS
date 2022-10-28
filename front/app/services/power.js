angular.module('bl.analyze.solar.surface')
  .service('powerService', ['$q', '$filter', '$sce', 'SocketIO', 'moment', 'solarTagService',
    function($q, $filter, $sce, SocketIO, moment, solarTagService) {
      var lastRTPInfo, lastCurrentPowerInfo;

      function getKPIFromRTP(rawRTP) {
        var productionBySources = [],
            totalPowerGeneration = 0;

        angular.forEach(rawRTP.generationBySources, function (generation, sourceId) {
          var sourceDetail = solarTagService.getSourceDetail(sourceId);
          productionBySources.push({
            'sourceId': generation.sourceId,
            'displayName': sourceDetail.displayName,
            'name': generation.name,
            'kw': (generation.kw.toFixed(1))/1,
            'trend': generation.trend,
            'color': sourceDetail.color || '#000'
          });

          totalPowerGeneration += (generation.kw.toFixed(1))/1;
        });

        return {
          'totalPowerGeneration': totalPowerGeneration.toFixed(1),
          'totalPowerGenerationTrend': rawRTP.totalGeneration.trend,
          'generationBySources': $filter('orderBy')(productionBySources, '+displayName')
        };
      }

      function getPrimaryFromRTP(rawRTP) {
        var xaxis, datapoints;

        // Convert date string to timestamp in User timezone;
        xaxis = rawRTP.mainChart.categories.map(function (originalDate) {
          return (new Date(originalDate)).valueOf();
        });

        // Insert the serie color from source detail
        datapoints = rawRTP.mainChart.series.map(function (serie) {
          var sourceDetail = solarTagService.getSourceDetail(serie.sourceId);

          if (sourceDetail) {
            serie.displayName = sourceDetail.displayName;
            serie.color = sourceDetail.color;
          } else if (serie.name === 'Total Generation') {
            // $brand-primary color;
            serie.color = '#e16030';
          } else {
            serie.color = randomColor({luminosity: 'dark'});
          }

          return serie;
        });

        return {
          'xAxis': xaxis,
          'datapoints': datapoints
        };
      }

      function pullLastPowerFromTags (rtpInfo) {

        // KPI update
        rtpInfo.kpiData.generationBySources = rtpInfo.kpiData.generationBySources.map(function (generation) {
          var sourceDetail = solarTagService.getSourceDetail(generation.sourceId);
          generation.kw = sourceDetail.lastReportedValue;
          return generation;
        });

        rtpInfo.kpiData.totalPowerGeneration = solarTagService.getLastTotalCurrentPower();

        // Primary Chart update

        rtpInfo.primary.datapoints = rtpInfo.primary.datapoints.map( function (datapoint) {
          if (datapoint.sourceId) {
            var sourceDetail = solarTagService.getSourceDetail(datapoint.sourceId);
            datapoint.data[datapoint.data.length - 1] = sourceDetail.lastReportedValue;
          } else {
            datapoint.data[datapoint.data.length - 1] = rtpInfo.kpiData.totalPowerGeneration;
          }
          return datapoint;
        });

        return rtpInfo;
      }

      this.pullLastPowerFromTags = pullLastPowerFromTags;

      this.watchRTPower = function (callback) {

        SocketIO.watch('assurf:realtimepower', function (data) {
          lastRTPInfo = {
            'history': !!data.history,
            'kpiData': data.totalGeneration ? getKPIFromRTP(data) : null,
            'primary': data.mainChart ? getPrimaryFromRTP(data) : null
          };

          if (data.dateRange === 'today'
            && lastRTPInfo.kpiData && lastRTPInfo.primary
            && solarTagService.getLastReportedDateTime()) {
            callback(pullLastPowerFromTags(lastRTPInfo));
          } else {
            callback(lastRTPInfo);
          }

        });

        return this;
      };

      this.watchCurrentPower = function (callback) {
        SocketIO.watch('assurf:power', function (data) {
          lastCurrentPowerInfo = {
            current: data.currentPower.toFixed(1),
            currentDayAvg: data.currentDayPower.toFixed(1),
            minAvg: data.minPower.toFixed(1),
            maxAvg: data.maxPower.toFixed(1)
          };

          var lastPowerSumOfSelectedNodes = solarTagService.getLastTotalCurrentPower();
          if (lastPowerSumOfSelectedNodes >= 0) {
            lastCurrentPowerInfo.current = lastPowerSumOfSelectedNodes;
          }

          callback(lastCurrentPowerInfo);
        });
        return this;
      };

      this.emitRTPower = function (dateRange) {
        var data = {
          'dateRange': dateRange || 'month'
        };

        SocketIO.emit('assurf:getrealtimepower', data);
      };
    }
  ]);