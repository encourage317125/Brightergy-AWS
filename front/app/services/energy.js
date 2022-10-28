angular.module('bl.analyze.solar.surface')
  .service('energyService', ['$q', '$filter', 'SocketIO', 'moment', 'solarTagService',
    function($q, $filter, SocketIO, moment, solarTagService) {
      var lastCurrentEnergy, lastTodayEnergyDrilldown, lastTEG, lastAvPE, lastSEG, lastSEGDrilldown, lastYield;

      function getKPIFromTEDrilldown(rawData) {
        var energyBySources  = [];

        angular.forEach(rawData.totalProductionBySources, function (production, key) {
          var sourceDetail = solarTagService.getSourceDetail(key);
          energyBySources.push({
            'name': sourceDetail.name,
            'displayName': sourceDetail.displayName,
            'color': sourceDetail ? sourceDetail.color : '#000',
            'kwh': production.kwh
          });
        });

        return {
          'totalEnergy': rawData.totalProduction,
          'energyBySources': energyBySources
        };
      }
      
      function getSerieFromTEDrilldown(data, isPowerData) {
        return data.categories.map(function (datetime, idx) {
          return [
            (new Date(datetime)).valueOf(),
            (isPowerData && (new Date(datetime)).valueOf() >= new Date().valueOf())
              ? null : data.series[0].data[idx],
          ];
        });
      }

      this.watchCurrentEnergy = function (callback) {
        SocketIO.watch('assurf:energy', function (data) {
          lastCurrentEnergy = {
            today: Math.round(data.energyToday),
            utilitySavingToday: Math.round(data.utilitySavingToday),
            utilitySavingMonth: Math.round(data.utilitySavingMonth),
            minAvg: Math.round(data.minEnergy),
            maxAvg: Math.round(data.maxEnergy)
          };

          lastCurrentEnergy.unit = data.energyToday >= 1000 ? 'MWh' : 'kWh';

          callback(lastCurrentEnergy);
        });
        return this;
      };

      this.emitEnergyDrillDown = function () {
        var data = {
          'viewerTZOffset': new Date().getTimezoneOffset() * -1
        };

        SocketIO.emit('assurf:getenergytodaykpidrilldown', data);
      };

      this.watchEnergyDrillDown = function (callback) {

        SocketIO.watch('assurf:energytodaykpidrilldown', function (data) {
          lastTodayEnergyDrilldown = {
            kpi: getKPIFromTEDrilldown(data),
            chart: {
              energy: {
                name: 'Energy Produced',
                data: getSerieFromTEDrilldown(data.energy, false)
              },
              power: {
                name: 'Current Power',
                data: getSerieFromTEDrilldown(data.power, true)
              }
            }
          };

          callback(lastTodayEnergyDrilldown);
        });
        return this;
      };

      this.watchTEG = function (callback) {
        SocketIO.watch('assurf:totalenergygeneration', function(data) {
          lastTEG = {
            value: data.totalEnergyGeneration,
            unit: 'kWh'
          };

          if (data.totalEnergyGeneration < 1000) {
            lastTEG.unit = 'kWh';
          } else if (data.totalEnergyGeneration >= 1000) {
            lastTEG.unit = 'MWh';
          } else if (data.totalEnergyGeneration >= 1000000) {
            lastTEG.unit = 'gWh';
          }

          callback(lastTEG);
        });
      };

      this.emitTEG = function (dateRange) {
        var data = {
          'dateRange': dateRange || 'month'
        };

        SocketIO.emit('assurf:gettotalenergygeneration', data);
      };

      this.watchAvPE = function (callback) {
        SocketIO.watch('assurf:actualpredictedenergy', function (avpeData) {
          lastAvPE = avpeData;
          callback(lastAvPE);
        });
      };

      this.emitAvPE = function (dateRange) {
        var data = {
          'dateRange': dateRange || 'month'
        };
        SocketIO.emit('assurf:inputactualpredictedenergy', data);
      };

      function getKPIFromSEG(rawSEG) {
        var totalProductionBySources = [];

        angular.forEach(rawSEG.totalProductionBySources, function (production, sourceId) {
          var sourceDetail = solarTagService.getSourceDetail(sourceId);

          totalProductionBySources.push({
            'id': sourceDetail.id,
            'displayName': sourceDetail.displayName,
            'name': sourceDetail.name,
            'kwh': Math.round(production.kwh),
            'color': sourceDetail.color || '#000'
          });
        });

        return {
          'totalProduction': Math.round(rawSEG.totalProduction),
          'totalSaving': Math.round(rawSEG.totalSaving * 100) / 100,
          'totalProductionBySources': $filter('orderBy')(totalProductionBySources, '+displayName')
        };
      }

      function getPrimaryFromSEG(rawSEGMain) {
        var xaxis,
          datapoints;

        // Convert date string to timestamp in User timezone;
        xaxis = rawSEGMain.categories.map(function (originalDate) {
          return {
            'type': originalDate.type,
            'value': (new Date(originalDate.value)).valueOf()
          };
        });

        // Insert the serie color from source detail
        datapoints = rawSEGMain.series.map(function (serie) {

          if (serie.sourceId) {
            var sourceDetail = solarTagService.getSourceDetail(serie.sourceId);
            serie.displayName = sourceDetail.displayName;
            serie.color = sourceDetail.color || '#000';
          } else if (serie.name === 'Total Generation') {
            // $brand-primary color;
            serie.color = '#e16030';
          }

          return serie;
        });

        return {
          'categories': xaxis,
          'series': datapoints
        };
      }

      function getPieFromSEG(rawSEGPie) {
        var series = angular.copy(rawSEGPie.series);

        series[0].data = series[0].data.map(function (data) {
          var sourceDetail = solarTagService.getSourceDetail(data.sourceId);
          return sourceDetail ? [sourceDetail.displayName, data.percent, sourceDetail.color]
                              : [data.name, data.percent, randomColor({luminosity: 'dark'})];
        });

        return {
          series: series
        };
      }

      function getCandleFromSEG(rawSEG) {
        var series = rawSEG.candlestick.series;
        return {
          series: series
        };
      }

      this.watchSEG = function (callback) {
        SocketIO.watch('assurf:solarenergygeneration', function(rawSEG) {

          lastSEG = {
            'dateRange': rawSEG.dateRange,
            'kpiData': getKPIFromSEG(rawSEG),
            'primary': getPrimaryFromSEG(rawSEG.mainChart),
            'pie':  getPieFromSEG(rawSEG.pie)
          };

          callback(lastSEG);
        });
        return this;
      };

      this.emitSEG = function (requestData) {
        SocketIO.emit('assurf:getsolarenergygeneration', requestData);
      };

      this.emitSEGDrilldown = function (requestData) {
        SocketIO.emit('assurf:getsolarenergygenerationdrilldown', requestData);
      };

      this.watchSEGDrilldown = function (callback) {
//        if (lastSEGDrilldown) {
//          callback(lastSEGDrilldown);
//        }

        SocketIO.watch('assurf:solarenergygenerationdrilldown', function (rawSEGDrilldown) {
          lastSEGDrilldown = {
            'kpiData': getKPIFromSEG(rawSEGDrilldown),
            'candlestick': getCandleFromSEG(rawSEGDrilldown)
          };
          callback(lastSEGDrilldown);
        });
        return this;
      };

      function getYTDFromMonthlySerie (serie) {
        var YTD = [];
        for (var idx = 0; idx < serie.data.length; idx++) {
          if (!YTD.length) {
            YTD.push(serie.data[idx]);
          } else {
            YTD.push(YTD[idx -1] + serie.data[idx]);
          }
        }
        return YTD;
      }

      function getSerieFromYield (rawYield) {
        return {
          'currentKWh': rawYield[0],
          'current$': rawYield[1],
          'previousKWh': rawYield[2],
          'previous$': rawYield[3],
          'averageKWh': rawYield[4],
          'currentKWhYTD': {data: getYTDFromMonthlySerie(rawYield[0])},
          'current$YTD': {data:getYTDFromMonthlySerie(rawYield[1])},
          'previousKWhYTD': {data:getYTDFromMonthlySerie(rawYield[2])},
          'previous$YTD': {data:getYTDFromMonthlySerie(rawYield[3])}
        };
      }

      this.watchYieldComparison = function (callback) {
        SocketIO.watch('assurf:yieldcomparator', function (rawYield) {
          lastYield = {
            categories: rawYield.category.map(function (category) {
              return category.split('T')[0];
            }),
            series: getSerieFromYield (rawYield.series)
          };

          callback(lastYield);
        });
      };
    }
  ]);
