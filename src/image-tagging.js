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
      link: function (scope, element, attrs) {
        // Elements
        var image = element.find('img'),
            tagBox = element.find('.tag-box'),
            tagInput = tagBox.find('input');

        // Initial values
        scope.posX = 0;
        scope.posY = 0;
        scope.tagBoxVisible = false;

        scope.setPosition = function (x, y) {
          scope.posX = x;
          scope.posY = y;
        };

        scope.getTagBoxPosition = function () {
          var left,
              top,
              widthRatio,
              heightRatio;

          if (!scope.imageWidth || !scope.imageHeight) {
            scope.imageHeight = image.height();
            scope.imageWidth = image.width();
          }

          if (!scope.boxWidth || !scope.boxHeight) {
            scope.boxHeight = tagBox.outerHeight();
            scope.boxWidth = tagBox.outerWidth();
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

          scope.items.push(item);

          // Close the box
          scope.closeTagBox();
        };

        scope.openTagBox = function (e) {
          scope.setPosition(e.offsetX, e.offsetY);
          scope.title = '';
          scope.tagBoxVisible = true;
          tagInput.focus();
        };

        scope.closeTagBox = function () {
          scope.tagBoxVisible = false;
        };
      }
    };
  });
