app.directive('horizontalSlider', function ($ionicGesture) {
    return function(scope, element, attr) {
        var left = 0;
        var handleDrag = function(e) {
            element.css({
                '-webkit-transform': 'translate3d(' + (left + Math.round(e.gesture.deltaX)) + 'px, 0, 0)'
            });
            if (element.hasClass('slider-bounce')) {
                element.removeClass('slider-bounce');
            }
        };

        var releaseFn = function(e) {
            var pattern = new RegExp('translate3d\\((-?[0-9]*)px, 0, 0\\)'),
                pattern2 = new RegExp('(-?[0-9]*)px');
            var transformMatches = pattern.exec(element.css('-webkit-transform')),
                widthMatches = pattern2.exec(element.css('width'));
            left = Math.round(transformMatches[1]);
            var width = widthMatches[1];
            if(left < (320 - width)) left = 320 - width;
            if(left > 0) left = 0;
            element.addClass('slider-bounce');
            element.css({
                '-webkit-transform': 'translate3d(' + left + 'px, 0, 0)'
            });
        };

        var releaseGesture = $ionicGesture.on('release', releaseFn, element);
        var dragGesture = $ionicGesture.on('drag', handleDrag, element);
        scope.$on('$destroy', function() {
            $ionicGesture.off(dragGesture, 'drag', handleDrag);
        });
    }
});
