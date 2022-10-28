angular
  .module('blApp.components.auth')
  .directive('passwordStrengthMeter', function () {
    function getPasswordStrength (password) {
      /*var strengths = ["Blank", "Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
       var colors = ["#FF0000", "#FF0000", "#FFCC00", "#FFCC00", "#19D119", "#006600"];*/
      var score = 0;
      var regLower = /[a-z]/,
        regUpper = /[A-Z]/,
        regNumber = /\d/,
        regPunctuation = /[.,!@#$%^&*?_~\-?()]/;
      var hint = '';

      if (!password) {
        score = 0;
        hint = 'Enter Password';
      } else if (password.length < 4) {
        score = 1;
        hint = 'Too short';
      } else if (password.length < 6) {
        score = 2;
        hint = 'At least 6 chars length';
      } else {
        // length is >= 6 in here
        score = 2;
        /*if (regLower.test(password)) { score++; }*/
        if (regUpper.test(password)) { score++; }
        if (regNumber.test(password)) { score++; }


        if (regLower.test(password)
          && regUpper.test(password)
          && regNumber.test(password)
          && regPunctuation.test(password)) {
          // if it also has punctuation, then it gets a 6, otherwise just a 4
          score = 5;
        }

        if (!regLower.test(password)) {
          hint = 'At least 1 lower letter needed';
        } else if (!regUpper.test(password)) {
          hint = 'At least 1 capital letter needed';
        } else if (!regNumber.test(password)) {
          hint = 'At least 1 number needed';
        }
      }

      if (score === 5) {
        hint = 'You have perfect password!';
      } else if (score === 4) {
        hint = 'Looks good!';
      }

      return {
        strength: score,
        hint: hint
      };
    }

    function setStrength (strengthInfo, element) {
      var strengthClasses = ['', 'weak', 'medium', 'strong'],
        strengthClass = strengthClasses[Math.round(strengthInfo.strength / 2)];
      if (strengthInfo.strength === 4) {
        strengthClass = 'strong';
      }

      // Set password status string
      element
        .find('.password-status')
        .text(strengthInfo.hint)
        .removeClass(strengthClasses.join(' '))
        .addClass(strengthClass);

      element
        .find('ul li')
        .removeClass(strengthClasses.join(' '));

      for (var idx = 1; idx <= strengthInfo.strength; idx++) {
        element.find('#progress' + idx).addClass(strengthClass);
      }

      return strengthInfo.strength;
    }

    return {
      restrict: 'E',
      template: ['<div class="password-strength-wrapper">',
        '<p class="password-status" ng-bind="passwordHint"></p>',
        '<ul id="strength-meter-bar"><li id="progress1"><span class="bar"></span></li>',
        '<li id="progress2"><span class="bar"></span></li>',
        '<li id="progress3"><span class="bar"></span></li>',
        '<li id="progress4"><span class="bar"></span></li>',
        '<li id="progress5"><span class="bar"></span></li></ul></div>'].join(''),
      require: '^ngModel',
      scope: {
        ngModel: '=',
        passwordStrength: '='
      },
      link: function (scope, element) {
        scope.passwordHint = 'Blank Password';
        scope.$watch('ngModel', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            var strengthInfo = getPasswordStrength(newValue);
            element.attr('strength-score', strengthInfo.score); // Set strength score to attribute for UT

            scope.passwordStrength = setStrength(strengthInfo, element);
          }
        });
      }
    };
  });