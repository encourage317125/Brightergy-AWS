"use strict";

var clearDay  = "clear-day",
    clearNight = "clear-night",
    rain = "rain",
    snow = "snow",
    sleet = "sleet",
    wind = "wind",
    fog = "fog",
    cloudy = "cloudy",
    partlyCloudyDay = "partly-cloudy-day",
    partlyCloudyNight = "partly-cloudy-night",
    hail = "hail",
    thunderstorm = "thunderstorm",
    tornado = "tornado";

function getForecastNumberByText(icon) {
    if(!icon) {
        return null;
    } else if(icon === clearDay  ) {
        return 0;
    } else if(icon === clearNight) {
        return 1;
    } else if(icon === rain) {
        return 2;
    } else if(icon === snow) {
        return 3;
    } else if(icon === sleet) {
        return 4;
    } else if(icon === wind) {
        return 5;
    } else if(icon === fog) {
        return 6;
    } else if(icon === cloudy) {
        return 7;
    } else if(icon === partlyCloudyDay) {
        return 8;
    } else if(icon === partlyCloudyNight) {
        return 9;
    } else if(icon === hail) {
        return 10;
    } else if(icon === thunderstorm) {
        return 11;
    } else if(icon === tornado) {
        return 12;
    } else {
        return null;
    }
}

function getForecastTextByNumber(num) {
    if(num === null || num === undefined) {
        return null;
    }

    num = parseInt(num, 10);

    if(num === 0) {
        return clearDay ;
    } else if(num === 1) {
        return clearNight;
    } else if(num === 2) {
        return rain;
    } else if(num === 3) {
        return snow;
    } else if(num === 4) {
        return sleet;
    } else if(num === 5) {
        return wind;
    } else if(num === 6) {
        return fog;
    } else if(num === 7) {
        return cloudy;
    } else if(num === 8) {
        return partlyCloudyDay;
    } else if(num === 9) {
        return partlyCloudyNight;
    } else if(num === 10) {
        return hail;
    } else if(num === 11) {
        return thunderstorm;
    } else if(num === 12) {
        return tornado;
    } else {
        return null;
    }
}


// replace nights icons with analogue days icons
function replaceNightWithDay(stringIcon) {
    if (stringIcon === partlyCloudyNight) {
        return partlyCloudyDay;
    } else if (stringIcon === clearNight) {
        return clearDay;
    }
    return stringIcon;
}


exports.getForecastNumberByText = getForecastNumberByText;
exports.getForecastTextByNumber = getForecastTextByNumber;
exports.replaceNightWithDay = replaceNightWithDay;