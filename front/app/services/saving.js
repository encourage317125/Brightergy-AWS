angular.module('bl.analyze.solar.surface')
  .service('savingService', ['$filter', 'SocketIO', 'moment', 'solarTagService',
    function ($filter, SocketIO, moment, solarTagService) {
    var lastSaving, lastSavingTable;

    function getKPIfromSaving (raw) {
      var totalProductionBySources = [];
      angular.forEach(raw.totalProductionBySources, function (production, sourceId) {
        var sourceDetail = solarTagService.getSourceDetail(sourceId);
        totalProductionBySources.push({
          name: sourceDetail.name,
          displayName: sourceDetail.displayName,
          color: sourceDetail.color || '#000',
          sourceId: production.sourceId,
          kwh: production.kwh
        });
      });

      return {
        totalSavingPerDateRange: Math.round(raw.totalSavingPerDateRange),
        totalSavings: $filter('number')(raw.totalSavings, 2),
        totalProductionBySources: totalProductionBySources,
        totalProduction: raw.totalProduction
      };
    }

    function getAreachartFromSaving (rawAreaChart) {
      return {
        'series': rawAreaChart.series.map(function (serie) {
          var sourceDetail = solarTagService.getSourceDetail(serie.sourceId);

          return angular.extend(serie, {
            name: sourceDetail.displayName || serie.name,
            color: sourceDetail.color || randomColor({luminosity: 'dark'})
          });
        }),
        'categories': rawAreaChart.categories.map(function (date) {
          return (new Date(date)).valueOf();
        })
      };
    }

    function getCombochartFromSaving (rawComboChart) {
      return {
        'series': rawComboChart.series,
        'categories': rawComboChart.categories.map(function (date) {
          return (new Date(date)).valueOf();
        })
      };
    }

    function getSavingTable(rawTable) {

      return rawTable.table.map(function (row) {
        return {
          'date': (new Date(row.date)).valueOf(),
          'percent': Math.round(row.percent),
          'sources': row.sources,
          'totalPerPeriod': row.totalPerPeriod
        };
      });
    }

    this.watch = function (callback) {
      SocketIO.watch('assurf:savings', function (savings) {

        lastSaving = {
          areaChart: getAreachartFromSaving(savings.areaChart),
          comboChart: getCombochartFromSaving(savings.comboChart),
          kpi: getKPIfromSaving(savings)
        };

        callback(lastSaving);
      });
      return this;
    };

    this.emit = function (dateRange) {
      var requestData = {
        'dateRange': dateRange || 'month'
      };
      SocketIO.emit('assurf:getsavings', requestData);
    };

    this.watchTable = function (callback) {
      if (lastSavingTable) {
        callback(lastSavingTable);
      }
      SocketIO.watch('assurf:table', function (table) {
        lastSavingTable = getSavingTable(table);
        lastSavingTable = lastSavingTable.reverse();
        callback(lastSavingTable);
      });
      return this;
    };
  }]);