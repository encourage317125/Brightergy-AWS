angular.module('bl.analyze.solar.surface')
  .service('equivalenciesService', ['$filter', 'SocketIO',
    function($filter, SocketIO) {
      var lastEquiv, lastCarbon;

      this.watchEquivalencies = function (callback) {
        SocketIO.watch('assurf:equivalencies', function (equiv) {
          lastEquiv = {
            carsRemoved: equiv.passengerVehiclesPerYear,
            /*homePowered: equiv.homeElectricityUse,*/
            homePowered: equiv.homeEnergyUse,
            seedlingsGrown: equiv.numberOfTreeSeedlingsGrownFor10Years,
            refrigerators: equiv.refrigerators,
            mobilePhones: equiv.mobilePhones,
            batteries: equiv.aaBatteries,
            avoidedCarbon: equiv.avoidedCarbon,
            gallonsGas: equiv.gallonsOfGasoline,
            tankersGas: equiv.tankerTrucksFilledWithGasoline,
            railroadCarsCoal: equiv.railcarsOfCoalburned,
            barrelsOil: equiv.barrelsOfOilConsumed,
            propaneCylinders: equiv.propaneCylindersUsedForHomeBarbecues,
            powerPlants: equiv.coalFiredPowerPlantEmissionsForOneYear,
            kwh: $filter('number')(equiv.kwh, 0)
          };
          callback(lastEquiv);
        });
        return this;
      };

      this.emitEquivalencies = function (dateRange) {
        var data = {
          'dateRange': dateRange || 'month'
        };

        SocketIO.emit('assurf:getequivalencies', data);
      };

      this.watchCarbonAvoided = function (callback) {
        SocketIO.watch('assurf:carbonavoided', function (CA) {
          lastCarbon = {
            carbonAvoided: CA.carbonAvoided,
            carbonAvoidedTotal: CA.carbonAvoidedTotal
          };
          callback(lastCarbon);
        });
        return this;
      };

      this.emitCarbonAvoided = function (dateRange) {
        var data = {
          'dateRange': dateRange || 'month'
        };

        SocketIO.emit('assurf:getcarbonavoided', data);
      };
    }
  ]);