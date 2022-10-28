"use strict";

var moment = require("moment"),
    _ = require("lodash"),
    defaultConstEmissionFactor = 0.000823724,
    constHomeElectricityUse = 7.27,
    constGallonsOfGasoline = 0.00887,
    constPassengerVehiclesPerYear = 4.75,
    constBarrelsOfOilConsumed = 0.43,
    constTankerTrucksFilledWithGasoline = 75.54,
    constHomeEnergyUse = 10.97,
    constNumberOfTreeSeedlingsGrownFor10Years = 0.039,
    constAcresOfUSForestsStoringCarbonForOneYear = 1.22,
    constAcresOfUSForestsPreservedFromConversion = 129.51,
    constPropaneCylindersUsedForHomeBarbecues = 0.024,
    constRailcarsOfCoalBurned = 186.5,
    constTonsOfWasteRecycledInsteadOfLandFilled = 2.79,
    constCoalFiredPowerPlantEmissionsForOneYear = 3808651,
    constGreenhouseEmissionsInKilograms = 1000,
    constCo2AvoidedInKilograms = 1.115,
    constAABatteries = 0.003,
    constMobilePhones = 5.5,
    constRefrigerators = 1100,
    constMetricTonsToPounds = 2204.62;
    
function EquivalenciesCalculator(facilitiesData, startDate, endDate) {

    if (facilitiesData && _.isObject(facilitiesData)) {
        // AsSurf pass data by facility according to new formula based on facility-specific constEmissionFactor
        this.facilitiesData = facilitiesData;
    } else {
        // Present and DataSense keep using old formula based on static constEmissinFactor for all facilities
        // They pass total kwh
        this.kwh = facilitiesData || 0;
        this.facilitiesData = undefined;
    }
    this.startDate = startDate? moment(startDate) : moment.utc();
    this.endDate = endDate? moment(endDate) : moment.utc();
    this.daysInDateRange = this.endDate.diff(this.startDate, "days");

    if(this.daysInDateRange < 1) {
        this.daysInDateRange = 1;
    }

}

EquivalenciesCalculator.prototype.calc = function() {

    var kwhTotal = 0;
    var calcCOEmissions = 0;
    
    if (this.facilitiesData && _.isObject(this.facilitiesData)) {
        _.each(this.facilitiesData, function(fd) {
            kwhTotal += fd.kwh;
            calcCOEmissions += fd.kwh * (fd.constEmissionFactor ? fd.constEmissionFactor : defaultConstEmissionFactor);
        });
    } else {
        kwhTotal = this.kwh;
        calcCOEmissions = defaultConstEmissionFactor * kwhTotal;
    }

    return {
        homeElectricityUse: 
            (calcCOEmissions / constHomeElectricityUse),
        gallonsOfGasoline: 
            (calcCOEmissions / constGallonsOfGasoline),
        passengerVehiclesPerYear: 
            (calcCOEmissions / constPassengerVehiclesPerYear),
        barrelsOfOilConsumed: 
            (calcCOEmissions / constBarrelsOfOilConsumed),
        tankerTrucksFilledWithGasoline: 
            (calcCOEmissions / constTankerTrucksFilledWithGasoline),
        homeEnergyUse: 
            (calcCOEmissions / constHomeEnergyUse),
        numberOfTreeSeedlingsGrownFor10Years: 
            (calcCOEmissions / constNumberOfTreeSeedlingsGrownFor10Years),
        acresOfUSForestsStoringCarbonForOneYear: 
            (calcCOEmissions / constAcresOfUSForestsStoringCarbonForOneYear),
        acresOfUSForestPreservedFromConversionToCropland: 
            (calcCOEmissions / constAcresOfUSForestsPreservedFromConversion),
        propaneCylindersUsedForHomeBarbecues: 
            (calcCOEmissions / constPropaneCylindersUsedForHomeBarbecues),
        railcarsOfCoalburned: 
            (calcCOEmissions / constRailcarsOfCoalBurned),
        tonsOfWasteRecycledInsteadOfLandfilled: 
            (calcCOEmissions / constTonsOfWasteRecycledInsteadOfLandFilled),
        coalFiredPowerPlantEmissionsForOneYear: 
            (calcCOEmissions / constCoalFiredPowerPlantEmissionsForOneYear),
        greenhouseEmissionsInKilograms: 
            (calcCOEmissions / constGreenhouseEmissionsInKilograms),
        co2AvoidedInKilograms: 
            (calcCOEmissions / constCo2AvoidedInKilograms),
        aaBatteries: (kwhTotal / constAABatteries),
        refrigerators: (kwhTotal / constRefrigerators),
        mobilePhones: (kwhTotal / constMobilePhones),
        avoidedCarbon: (calcCOEmissions * constMetricTonsToPounds),
        avoidedCarbonTotal: (calcCOEmissions * constMetricTonsToPounds),
        kwh: kwhTotal
    };
};

EquivalenciesCalculator.getCommonData = function(items) {
    var commonData = {
        homeElectricityUse: 0,
        gallonsOfGasoline: 0,
        passengerVehiclesPerYear: 0,
        barrelsOfOilConsumed: 0,
        tankerTrucksFilledWithGasoline: 0,
        homeEnergyUse: 0,
        numberOfTreeSeedlingsGrownFor10Years: 0,
        acresOfUSForestsStoringCarbonForOneYear: 0,
        acresOfUSForestPreservedFromConversionToCropland: 0,
        propaneCylindersUsedForHomeBarbecues: 0,
        railcarsOfCoalburned: 0,
        tonsOfWasteRecycledInsteadOfLandfilled: 0,
        coalFiredPowerPlantEmissionsForOneYear: 0,
        greenhouseEmissionsInKilograms: 0,
        co2AvoidedInKilograms: 0,
        aaBatteries: 0,
        refrigerators: 0,
        mobilePhones: 0,
        avoidedCarbon: 0,
        avoidedCarbonTotal: 0,
        kwh: 0
    };

    for (var i = 0; i < items.length; i++) {
        commonData.homeElectricityUse += items[i].homeElectricityUse;
        commonData.gallonsOfGasoline += items[i].gallonsOfGasoline;
        commonData.passengerVehiclesPerYear += items[i].passengerVehiclesPerYear;
        commonData.barrelsOfOilConsumed += items[i].barrelsOfOilConsumed;
        commonData.tankerTrucksFilledWithGasoline += items[i].tankerTrucksFilledWithGasoline;
        commonData.homeEnergyUse += items[i].homeEnergyUse;
        commonData.numberOfTreeSeedlingsGrownFor10Years += items[i].numberOfTreeSeedlingsGrownFor10Years;
        commonData.acresOfUSForestsStoringCarbonForOneYear += items[i].acresOfUSForestsStoringCarbonForOneYear;
        commonData.acresOfUSForestPreservedFromConversionToCropland += 
            items[i].acresOfUSForestPreservedFromConversionToCropland;
        commonData.propaneCylindersUsedForHomeBarbecues += items[i].propaneCylindersUsedForHomeBarbecues;
        commonData.railcarsOfCoalburned += items[i].railcarsOfCoalburned;
        commonData.tonsOfWasteRecycledInsteadOfLandfilled += items[i].tonsOfWasteRecycledInsteadOfLandfilled;
        commonData.coalFiredPowerPlantEmissionsForOneYear += items[i].coalFiredPowerPlantEmissionsForOneYear;
        commonData.greenhouseEmissionsInKilograms += items[i].greenhouseEmissionsInKilograms;
        commonData.co2AvoidedInKilograms += items[i].co2AvoidedInKilograms;
        commonData.aaBatteries += items[i].aaBatteries;
        commonData.refrigerators += items[i].refrigerators;
        commonData.mobilePhones += items[i].mobilePhones;
        commonData.avoidedCarbon += items[i].avoidedCarbon;
        commonData.avoidedCarbonTotal += items[i].avoidedCarbonTotal;
        commonData.kwh += items[i].kwh;
    }

    return commonData;
};

exports.EquivalenciesCalculator = EquivalenciesCalculator;
