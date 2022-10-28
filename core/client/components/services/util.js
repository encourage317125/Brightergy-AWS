angular.module('blApp.components.services')
    .service('utilService', ['$timeout', '$http',
        function($timeout, $http) {

            this.parseName = function (name) {
                var addUserNameArray = name.split(' ');
                var addUserNames = ['', '', ''];
                switch (addUserNameArray.length) {
                    case 1:
                        addUserNames[0] = addUserNameArray[0].trim();
                        break;
                    case 2:
                        addUserNames[0] = addUserNameArray[0].trim();
                        addUserNames[2] = addUserNameArray[1].trim();
                        break;
                    case 3:
                        addUserNames[0] = addUserNameArray[0].trim();
                        addUserNames[1] = addUserNameArray[1].trim();
                        addUserNames[2] = addUserNameArray[2].trim();
                        break;
                }
                return addUserNames;
            };

            this.parseEmail = function (email) {
                var addUserEmailArray = email.split('@');
                var addUserEmails = ['', '', ''];
                addUserEmails[0] = email.trim();
                addUserEmails[1] = addUserEmailArray[0].trim();
                addUserEmails[2] = addUserEmailArray[1].trim();
                return addUserEmails;
            };

            this.parsePhoneNum = function (phonenum) {
                var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
                if (regexObj.test(phonenum)) {
                    var parts = phonenum.match(regexObj);
                    var phone = '';
                    if (parts[1]) {
                        phone += '1-' + parts[1] + '-';
                    }
                    phone += parts[2] + '-' + parts[3];
                    return phone;
                }
                else {
                    //invalid phone number
                    return phonenum;
                }
            };

            /**
             * Parse Address using SmartyStreet API
             * If invalid address, it will return back raw inputted address,
             * If valid address, it will return object of City name, Street name, Zip code, State
             * @param address {string} User's raw inputted address
             * @param callback
             * @returns {*}
             */
            this.parseAddress = function (address, callback) {

                function getRegionByCountry(country) {
                    return 'North America';
                }

                function getContinentByCountry(country) {
                    return 'North America';
                }

                var apiUrl = '/location/address/street=' + address,
                    parsedAddress = {
                        street: '',
                        city: '',
                        country: '',
                        state: '',
                        postalCode: '',
                        continent: '',
                        region: '',
                        address: address
                    };
                if (!address) {
                    return callback(parsedAddress);
                }

                $http
                    .get(apiUrl)
                    .then(function (resp) {
                        if (!resp.length) {
                            return callback(parsedAddress);
                        }
                        var comp = resp[0].components;
                        angular.extend(parsedAddress, {
                            street: [comp['street_name'], comp['street_suffix']].join(' '),
                            city: comp['city_name'],
                            state: comp['state_abbreviation'],
                            postalCode: comp['zipcode'],
                            country: 'USA',
                            continent: getContinentByCountry('USA'),
                            region: getRegionByCountry('USA')/*,
                             address: [ data.message[0].delivery_line_1, data.message[0].last_line ].join(' ')*/
                        });
                        if (comp['street_postdirection']) {
                            parsedAddress.street += ' ' + comp['street_postdirection'];
                        }
                        return callback(parsedAddress);
                    }, function () {
                        return callback(parsedAddress);
                    });
            };

            this.getUtilityProviders = function (uprovider) {
                var apiUrl = '/salesforce/utilityproviders/' + uprovider;
                return $http.get(apiUrl);
            };

            this.sendEmailOfNewUtil = function (uprovider) {
                var apiUrl = '/notifications/email/newutilityprovider',
                    data = {
                        'text': uprovider
                    };
                return $http
                    .post(apiUrl, data)
                    .then(function (resp) {
                        console.log('Email Results...');
                        console.log(resp);
                        return resp;
                    });
            };

            this.getCurrentBaseURL = function () {
                return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
            };

            this.getTimeZones = function () {
                var apiUrl = '/others/devices/timezones';
                return $http.get(apiUrl).then(function (data) {
                    console.log('[UTIL SERVICE] SUCCESS on getTimeZoneList : ', data);
                    return data;
                });
            };

            this.CSVToArray = function (strData, strDelimiter) {
                strDelimiter = (strDelimiter || ',');
                // Create a regular expression to parse the CSV values.
                var objPattern = new RegExp((
                // Delimiters.
                '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +
                // Quoted fields.
                '(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|' +
                // Standard fields.
                '([^\"\\' + strDelimiter + '\\r\\n]*))'), 'gi');
                
                var arrData = [[]];
                var strMatchedValue = '';
                var arrMatches = objPattern.exec(strData);
                
                while (arrMatches) {
                    var strMatchedDelimiter = arrMatches[1];
                    
                    if (strMatchedDelimiter.length && (strMatchedDelimiter !== strDelimiter)) {
                        arrData.push([]);
                    }
                    
                    if (arrMatches[2]) {
                        strMatchedValue = arrMatches[2].replace(
                        new RegExp('\"\"', 'g'), '\"');
                    } else {
                        strMatchedValue = arrMatches[3];
                    }
                    
                    arrData[arrData.length - 1].push(strMatchedValue);

                    arrMatches = objPattern.exec(strData);
                }
                
                return (arrData);
            };

            this.arrayToJSON = function (array) {
                var objArray = [];
                for (var i = 1; i < array.length; i++) {
                    objArray[i - 1] = {};
                    for (var k = 0; k < array[0].length; k++) {
                        var key = array[0][k];
                        
                        if(array[i][k] !== undefined) {
                            objArray[i - 1][key] = array[i][k];
                        }
                        else {
                            objArray[i - 1][key] = '';
                        }
                    }
                }

                var json = JSON.stringify(objArray);
                var str = json.replace(/},/g, '},\r\n');

                return str;
            };

            this.getClientTimeZone = function () {
                var offSet = new Date().getTimezoneOffset() * -1;
                var apiUrl = '/others/devices/clientTimezone?offset=' + offSet;
                return $http
                    .get(apiUrl)
                    .then(function (data) {
                        console.log('[UTIL SERVICE] SUCCESS on getClientTimeZone : ', data);
                        return data;
                    });
            };
        }
    ]);
