app.directive('paperSection', function() {

    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {

            function drawEmptyBoard(element) {

                if (scope.polygon != undefined || scope.a.section_type == "CIRC") {

                    if (!scope.paper) {
                        scope.paper = new paper.PaperScope();
                        scope.paper.setup(element);
                    }

                    scope.paper.project.activeLayer.removeChildren();

                    paper = scope.paper;

                    var max;

                    if (scope.a.geometry.isValid) {

                        if (scope.a.section_type == "CIRC") {
                            max = scope.a.geometry.diam;
                        } else {
                            if (scope.a.geometry.height > scope.a.geometry.width) {
                                max = scope.a.geometry.height;
                            } else {
                                max = scope.a.geometry.width;
                            }
                        }

                        scale = 500 / max;

                        var margin = 0;

                        if (scope.a.section_type == "CIRC") {
                            var myPath = new paper.Path.Circle({
                                center: [250, 250],
                                radius: scope.a.geometry.diam * scale / 2
                            });

                        } else {
                            var seg = [];
                            for (var i = 0; i < scope.polygon.length; i = i + 2) {
                                seg.push([(scope.polygon[i] * scope.rotVector[0] - scope.transVector[0]) * scale + margin, (scope.polygon[i + 1] * scope.rotVector[1] - scope.transVector[1]) * scale + margin]);
                            }
                            var myPath = new paper.Path({
                                segments: seg,
                                selected: false
                            });
                        }
                        myPath.fillColor = "#C0B44A";
                        myPath.strokeColor = 'black';


                        for (var i = 0; i < scope.a.reinforcement.length; i++) {
                            // console.log(scope.a.reinforcement[i]);
                            var center = new paper.Point((scope.a.reinforcement[i].y * scope.rotVector[0] - scope.transVector[0]) * scale + margin, (scope.a.reinforcement[i].z * scope.rotVector[1] - scope.transVector[1]) * scale + margin);
                            var circle = new paper.Path.Circle(center, parseFloat((scope.a.reinforcement[i].diam / 1000) * scale));
                            if (scope.a.reinforcement[i].valid) {
                                circle.fillColor = 'black';
                            } else {
                                circle.fillColor = 'red';
                            }

                        }
                    } else {
                        var text = new paper.PointText(new paper.Point(250, 250));
                        text.justification = 'center';
                        text.fillColor = 'black';
                        text.content = 'Invalid geometry';
                    }


                    paper.view.draw();
                }
            }

            // scope.a.$promise.then(function () {
            //     drawEmptyBoard(element[0]);
            // });

            scope.$watchCollection("polygon", function(newCollection, oldCollection, scope) {
                drawEmptyBoard(element[0]);
            });

            scope.$watch("a.reinforcement", function(newCollection, oldCollection, scope) {
                drawEmptyBoard(element[0]);
            }, true);



        }
    };

});