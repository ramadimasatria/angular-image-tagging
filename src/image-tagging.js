angular.module('imageTagging', [])
  .directive('imageTag', function () {
    return {
      templateUrl: 'image-tagging.tpls.html',
      restrict: 'E',
      replace: true,
      scope: {
        imgSrc: '=',
        items: '=',
      },
      controller: function ($scope) {
        $scope.submit = function (item) {
          $scope.items.push(item);
        };

        $scope.openTagBox = function (e) {
          $scope.$emit('openTagBox', {
            x: e.offsetX,
            y: e.offsetY
          });
        };

        $scope.closeTagBox = function (e) {
          $scope.$emit('closeTagBox');
        };
      },
      link: function (scope, element, attrs) {
        var imageEl = element.find('img');

        scope.setImageSize = function (){
          scope.imageHeight = imageEl.height();
          scope.imageWidth = imageEl.width();
        };
      }
    };
  })

  .directive('imageTagBox', function () {
    return {
      templateUrl: 'image-tagging-box.tpls.html',
      restrict: 'E',
      require: '^imageTag',
      replace: true,
      link: function (scope, element) {
        var inputEl = element.find('input');

        scope.tagBoxVisible = false;
        scope.title = "";

        scope.setPosition = function (x, y) {
          scope.posX = x;
          scope.posY = y;
        };

        scope.setBoxSize = function () {
          scope.boxHeight = element.outerHeight();
          scope.boxWidth = element.outerWidth();
        };

        scope.$on('openTagBox', function (e, data) {
          inputEl.focus();

          scope.setPosition(data.x, data.y);
          scope.title = '';
          scope.tagBoxVisible = true;
        });

        scope.$on('closeTagBox', function () {
          scope.tagBoxVisible = false;
        });

        scope.getPosition = function () {
          var left,
              top,
              widthRatio,
              heightRatio;

          if (!scope.imageWidth || !scope.imageHeight) {
            scope.setImageSize();
          }

          if (!scope.boxWidth || !scope.boxHeight) {
            scope.setBoxSize();
          }

          widthRatio = scope.posX / scope.imageWidth;
          heightRatio = scope.posY / scope.imageHeight;

          if (widthRatio <= 0.7 && heightRatio <= 0.7) { // 0.7 is arbitrary number. It should be determined with box size
            // top left
            left = scope.posY;
            top = scope.posX;
          } else
          if(widthRatio > 0.7 && heightRatio <= 0.7) {
            // top right
            left = scope.posY;
            top = scope.posX - scope.boxWidth;
          } else
          if(widthRatio <= 0.7 && heightRatio > 0.7) {
            // bottom left
            left = scope.posY - scope.boxHeight;
            top = scope.posX;
          } else {
            // bottom right
            left = scope.posY - scope.boxHeight;
            top = scope.posX - scope.boxWidth;
          }

          return {
            left: top,
            top: left
          };
        };

        scope.submitItem = function (e) {
          if (e.keyCode !== 13 || !scope.title) {
            return
          }

          var item = {
            title: scope.title,
            position: {
              x: scope.posX,
              y: scope.posY
            },
            posRatio: {
              x: scope.posX / scope.imageWidth,
              y: scope.posY / scope.imageHeight
            }
          };

          scope.submit(item);
          scope.closeTagBox();
        };

      }
    };
  })

  .directive('imageTagItem', function () {
    return {
      template: '<span class="tag-item">{{ title }}</span>',
      replace: true,
      scope: {
        title: '=',
        position: '='
      },
      link: function (scope, element) {
        element.css({
          left: scope.position.x,
          top: scope.position.y,
        })
      }
    };
  })
;
