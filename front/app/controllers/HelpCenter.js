angular.module('bl.analyze.solar.surface')
    .controller('HelpCenterController', ['$scope', '$location',
        function ($scope, $location) {
        	$scope.articleView = false;
        	$scope.homeView = true;

        	$scope.openTicketCount = 2;

        	$scope.knowledgeArticles = [
        		{
        			title: 'Real-Time Power'
        		},
        		{
        			title: 'Value of Solar Energy Produced'
        		},        		
        		{
        			title: 'Energy'
        		},        		
        		{
        			title: 'Avoided Carbon'
        		},        		
        		{
        			title: 'Total Energy Production'
        		},        		
        		{
        			title: 'Yield Comparison'
        		},        		
        		{
        			title: 'Equivalencies'
        		},        		
        		{
        			title: 'Produced vs Estimated'
        		},        		
        		{
        			title: 'Power Plant Details'
        		},        		
        		{
        			title: 'Irradiance vs Energy'
        		}
        	];

        	$scope.staticGlossary =
            ['Popular','All','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T',
              'U','V','W','X','Y','Z'];

          $scope.filteredGlossary = ['kW','kwH','Current weather','Production','Carbon','Irradiance','Power','Energy',
                                      'Drildown','Real-time power','Equivalencies'];

          $scope.faqArticles = [
            {
              title: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod ' +
                     'tincidunt ut laoreet dolore magna consectetuer adipiscing elit, aliquam erat volutpat?'
            },
            {
              title: 'Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat?'
            },
            {
              title: 'Consectetuer adipiscing elit, Sed diam nonummy nibh euismod tincidunt ut laoreet dolore ' +
                     'magna aliquam erat volutpat?'
            },
            {
              title: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod ' +
                     'tincidunt ut laoreet dolore magna consectetuer adipiscing elit, aliquam erat volutpat?'
            },
            {
              title: 'Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat?'
            },
            {
              title: 'Consectetuer adipiscing elit, Sed diam nonummy nibh euismod tincidunt ut laoreet dolore ' +
                     'magna aliquam erat volutpat?'
            }
          ];

          $scope.closeHelp = function() {
              if ($scope.articleView === true)
              {
                  $scope.homeView = true;
                  $scope.articleView = false;
              }
              else
              {
                  $location.path('/main', false);
              }
          };

          $scope.goArticle = function() {
            $scope.articleView = true;
            $scope.homeView = false;
          };
        }
    ]);