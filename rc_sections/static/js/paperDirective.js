
app.directive('paperSection', function() {

    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {

            function drawEmptyBoard(element) {

                if (!scope.paper) {
                    scope.paper = new paper.PaperScope();
                    scope.paper.setup(element);
                }

                scope.paper.project.activeLayer.removeChildren();

                paper = scope.paper;

                var margin = 10;

                var leftBot = new paper.Point(margin+0, margin+0);
                var leftTop = new paper.Point(margin+0, margin+scope.a.geometry.height*1000);
                var rightTop = new paper.Point(margin+scope.a.geometry.width*1000, margin+scope.a.geometry.height*1000);
                var rightBot = new paper.Point(margin+scope.a.geometry.width*1000, margin+0);

                var left = new paper.Path();
                left.strokeColor = 'black';
                left.moveTo(leftBot);
                left.lineTo(leftTop);

                var top = new paper.Path();
                top.strokeColor = 'black';
                top.moveTo(leftTop);
                top.lineTo(rightTop);

                var right = new paper.Path();
                right.strokeColor = 'black';
                right.moveTo(rightTop);
                right.lineTo(rightBot);

                var bottom = new paper.Path();
                bottom.strokeColor = 'black';
                bottom.moveTo(rightBot);
                bottom.lineTo(leftBot);

                for (var i = 0; i< scope.a.reinforcement.length; i++){

                    var center = new paper.Point(scope.a.reinforcement[i].y*1000+margin, scope.a.reinforcement[i].z*1000+margin);
                    var circle = new paper.Path.Circle(center, scope.a.reinforcement[i].diam);
                    circle.fillColor = 'black';

                }

                paper.view.draw();
            }

            scope.a.$promise.then(function () {
                drawEmptyBoard(element[0]);
            });

            scope.$watchCollection("a.geometry", function(newCollection, oldCollection, scope) {
                drawEmptyBoard(element[0]); 
            });


        }
    };

});