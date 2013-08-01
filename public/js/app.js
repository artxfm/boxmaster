var app = angular.module('boxmaster', []);



// bmModal - Call the bootstrap modal dialog hide/show methods
//           when magic scope variable changes.
//
app.directive('bmModal', function() {
    return {
      restrict: 'C',
      replace: false,

      // Hmm, this did not work, so we just hard code
      // dialogIsActive scope variable below.  Hmm.
      // scope: { active: '@bm-modal-active' },

      link: function(scope, element, attrs) {
        scope.$watch("dialogIsActive", function(newval, oldval) {
          if (newval) {
            $("#confirmDlg").modal('show');
          }
          else {
            $("#confirmDlg").modal('hide');
          }
        });
      }
    }
  });
