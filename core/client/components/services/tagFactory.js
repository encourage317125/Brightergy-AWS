/**
 * Created factory for avoid duplicated request for tagAPIs
 * 
 */

angular.module('blApp.components.services')
    .factory('tagFactory', ['$http', '$q',
        function($http, $q) {
            var accessibleTags = {};
            var deferQueue = [];
            /**
             * Call api to retrieve all accessible tags by specific user
             * api - /userapi/tags/{userId}
             * method - GET
             * @param {string} userId Current User ID
             * @return {object}
             */

            return {
                listAccessibleTagsByUser : function(userId) {
                    var deferred, i;
                    if (accessibleTags[userId] === false)  {
                        deferred = $q.defer();
                        deferQueue.push({id: userId, d: deferred});
                        return deferred.promise;
                    } else if (typeof accessibleTags[userId] !== 'undefined') {
                        deferred = $q.defer();
                        deferred.resolve(accessibleTags[userId]);
                        return deferred.promise;
                    } else {
                        accessibleTags[userId] = false;
                        return $http
                                .get('/users/' + userId + '/tags?limit=2&offset=0')
                                .then(function (resp) {
                                    accessibleTags[userId] = resp;
                                    for (i = deferQueue.length - 1; i >= 0; i--) {
                                        if (deferQueue[i].id === userId) {
                                            deferQueue[i].d.resolve(accessibleTags[userId]);
                                            deferQueue = deferQueue.slice(i, 1);
                                        }
                                    }
                                    console.log('Accessible Tag List', resp);
                                }, function (resp) {
                                    console.log('*ERROR* : listAccessibleTagsByUser', resp);
                                });
                    }
                },
                addAccessibleTags : function(userTags, userId) {
                    var i;
                    accessibleTags[userId] = userTags[userId];
                    for (i = deferQueue.length - 1; i >= 0; i--) {
                        if (deferQueue[i].id === userId) {
                            deferQueue[i].d.resolve(accessibleTags[userId]);
                            deferQueue = deferQueue.slice(i, 1);
                        }
                    }
                }
            };
        }
    ]);