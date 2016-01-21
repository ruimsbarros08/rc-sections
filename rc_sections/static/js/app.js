var app = angular.module('app', ['ngResource', 'ui.router', 'ngHandsontable', 'ui-notification', 'ui.bootstrap']);

app.factory('Section', ['$resource', function($resource) {
	return $resource('/api/sections/:id/', null, {
		'update': {
			method: 'PUT'
		}
	});
}]);

app.config(["$locationProvider", "$urlRouterProvider", "$stateProvider", "$resourceProvider", "$httpProvider", "NotificationProvider", function($locationProvider, $urlRouterProvider, $stateProvider, $resourceProvider, $httpProvider, NotificationProvider) {
	$locationProvider.html5Mode(true);

	$resourceProvider.defaults.stripTrailingSlashes = false;

	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

	$urlRouterProvider.otherwise("/");

	NotificationProvider.setOptions({
		delay: 10000,
		startTop: 20,
		startRight: 10,
		verticalSpacing: 20,
		horizontalSpacing: 20,
		positionX: 'left',
		positionY: 'bottom'
	});

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "static/partials/home.html",
			controller: ["$scope", "$state", function($scope, $state) {


			}],
		})
		.state('sections', {
			url: "/sections/",
			templateUrl: "static/partials/sections.html",
			resolve: {
				sections: ["Section", function(Section) {
					return Section.query();
				}],
			},
			controller: ["$scope", "$state", "sections", "Section", "Notification", "$window", "$uibModal", function($scope, $state, sections, Section, Notification, $window, $uibModal) {
				$scope.sections = sections;

				$scope.open = function() {

					var modalInstance = $uibModal.open({
						animation: true,
						backdrop: 'static',
						size: 'md',
						templateUrl: 'static/partials/create_section_modal.html',
						controller: function($scope, $uibModalInstance, sections) {

							$scope.section_types = [{
								id: "RECT",
								label: "Rectangular"
							}, {
								id: "CIRC",
								label: "Circular"
							}, {
								id: "T",
								label: "T"
							}, {
								id: "I",
								label: "I"
							}, {
								id: "U",
								label: "U"
							}];

							$scope.submitCreateSectionForm = function(isValid) {

								if (isValid) {
									var newSection = new Section($scope.new_sec);
									newSection.$save(function(data) {
										sections.push(data);
										$state.transitionTo('sections.detail', {
											id: data.id
										});
										Notification.success('Section created');
									}, function(response) {
										// if (response.status === 401 || response.status === 403) {
										// 	$window.open('', "_self");
										// } else {
										// };
										Notification.error(response.data.detail);
									});
									$uibModalInstance.close();
								}
							}
							$scope.cancel = function() {
								$uibModalInstance.dismiss('cancel');
							};
						},
						resolve: {
							sections: function() {
								return $scope.sections;
							}
						},
					});
				};
			}],
		})
		.state('sections.detail', {
			parent: 'sections',
			url: ":id",
			templateUrl: "static/partials/sections.detail.html",
			resolve: {
				section: ["Section", "$stateParams", function(Section, $stateParams) {
					return Section.get({
						id: $stateParams.id
					});
				}],
			},
			controller: ["$scope", "$state", "section", "Section", "Notification", "$window", function($scope, $state, section, Section, Notification, $window) {
				$scope.a = section;
				$scope.polygon;

				$scope.concrete_classes = [{
					id: "C12_15",
					label: "C12/15"
				}, {
					id: "C16_20",
					label: "C16/20"
				}, {
					id: "C20_25",
					label: "C20/25"
				}, {
					id: "C25_30",
					label: "C25/30"
				}, {
					id: "C30_37",
					label: "C30/37"
				}, {
					id: "C35_45",
					label: "C35/45"
				}, {
					id: "C40_50",
					label: "C40/50"
				}, {
					id: "C45_55",
					label: "C45/55"
				}, {
					id: "C50_60",
					label: "C50/60"
				}, {
					id: "C55_67",
					label: "C55/67"
				}, {
					id: "C60_75",
					label: "C60/75"
				}, {
					id: "C70_85",
					label: "C70/85" 
				}, {
					id: "C80_95",
					label: "C80/95"
				}, {
					id: "C90_105",
					label: "C90/105"
				}, ];
				$scope.steel_classes = ["A400", "A500"];

				$scope.diams = [6, 8, 10, 12, 20, 25, 32];

				$scope.updateGeometry = function() {

					switch ($scope.a.section_type) {
						case "RECT":
							$scope.transVector = [-$scope.a.geometry.width / 2, -$scope.a.geometry.height / 2];
							$scope.rotVector = [1, -1];
							$scope.polygon = [
								(0 + $scope.transVector[0]) * $scope.rotVector[0], (0 + $scope.transVector[1]) * $scope.rotVector[1], ($scope.a.geometry.width + $scope.transVector[0]) * $scope.rotVector[0], (0 + $scope.transVector[1]) * $scope.rotVector[1], ($scope.a.geometry.width + $scope.transVector[0]) * $scope.rotVector[0], ($scope.a.geometry.height + $scope.transVector[1]) * $scope.rotVector[1], (0 + $scope.transVector[0]) * $scope.rotVector[0], ($scope.a.geometry.height + $scope.transVector[1]) * $scope.rotVector[1], (0 + $scope.transVector[0]) * $scope.rotVector[0], (0 + $scope.transVector[1]) * $scope.rotVector[1]
							];
							break;
						case "T":
							$scope.transVector = [-$scope.a.geometry.width / 2, -($scope.a.geometry.height / 2)];
							$scope.rotVector = [1, -1];
							$scope.polygon = [
								($scope.a.geometry.width / 2 - $scope.a.geometry.bw / 2) * $scope.rotVector[0] + $scope.transVector[0], -(0) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width / 2 + $scope.a.geometry.bw / 2) * $scope.rotVector[0] + $scope.transVector[0], -(0) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width / 2 + $scope.a.geometry.bw / 2) * $scope.rotVector[0] + $scope.transVector[0], -(($scope.a.geometry.height - $scope.a.geometry.hf)) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width) * $scope.rotVector[0] + $scope.transVector[0], -(($scope.a.geometry.height - $scope.a.geometry.hf)) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height) * $scope.rotVector[1] + $scope.transVector[1], (0) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height) * $scope.rotVector[1] + $scope.transVector[1], (0) * $scope.rotVector[0] + $scope.transVector[0], -(($scope.a.geometry.height - $scope.a.geometry.hf)) * $scope.rotVector[1] + $scope.transVector[1], (0) * $scope.rotVector[0] + $scope.transVector[0], -(($scope.a.geometry.height - $scope.a.geometry.hf)) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width / 2 - $scope.a.geometry.bw / 2) * $scope.rotVector[0] + $scope.transVector[0], -(($scope.a.geometry.height - $scope.a.geometry.hf)) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width / 2 - $scope.a.geometry.bw / 2) * $scope.rotVector[0] + $scope.transVector[0], -(0) * $scope.rotVector[1] + $scope.transVector[1]
							];
							break;
						case "I":
							$scope.transVector = [-$scope.a.geometry.width / 2, -($scope.a.geometry.hf1 + ($scope.a.geometry.height - $scope.a.geometry.hf1 - $scope.a.geometry.hf2) / 2)];
							$scope.rotVector = [1, -1];
							$scope.polygon = [
								(0) * $scope.rotVector[0] + $scope.transVector[0], -(0) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width) * $scope.rotVector[0] + $scope.transVector[0], -(0) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.hf2) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width / 2 + $scope.a.geometry.bw / 2) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.hf2) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width / 2 + $scope.a.geometry.bw / 2) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height - $scope.a.geometry.hf1) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height - $scope.a.geometry.hf1) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height) * $scope.rotVector[1] + $scope.transVector[1], (0) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height) * $scope.rotVector[1] + $scope.transVector[1], (0) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height - $scope.a.geometry.hf1) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width / 2 - $scope.a.geometry.bw / 2) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height - $scope.a.geometry.hf1) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width / 2 - $scope.a.geometry.bw / 2) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.hf2) * $scope.rotVector[1] + $scope.transVector[1], (0) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.hf2) * $scope.rotVector[1] + $scope.transVector[1], (0) * $scope.rotVector[0] + $scope.transVector[0], -(0) * $scope.rotVector[1] + $scope.transVector[1]
							];
							break;
						case "U":
							$scope.transVector = [-$scope.a.geometry.width / 2, -$scope.a.geometry.height / 2];
							$scope.rotVector = [1, -1];
							$scope.polygon = [
								(0) * $scope.rotVector[0] + $scope.transVector[0], -(0) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width) * $scope.rotVector[0] + $scope.transVector[0], -(0) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width - $scope.a.geometry.w2t) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.width - $scope.a.geometry.w2t) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.wbt) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.w1t) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.wbt) * $scope.rotVector[1] + $scope.transVector[1], ($scope.a.geometry.w1t) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height) * $scope.rotVector[1] + $scope.transVector[1], (0) * $scope.rotVector[0] + $scope.transVector[0], -($scope.a.geometry.height) * $scope.rotVector[1] + $scope.transVector[1], (0) * $scope.rotVector[0] + $scope.transVector[0], -(0) * $scope.rotVector[1] + $scope.transVector[1]
							];
							break;
						case "CIRC":
							$scope.transVector = [-$scope.a.geometry.diam / 2, -$scope.a.geometry.diam / 2];
							$scope.rotVector = [1, -1];
							$scope.polygon = undefined;
							break;
						default:
							$scope.transVector = undefined;
							$scope.rotVector = undefined;
							$scope.polygon = undefined;
					}

					for (var i = 0; i < $scope.a.reinforcement.length; i++) {
						validateReinforcement(i);
					}
				}

				$scope.$watchCollection("a.geometry", function() {
					$scope.a.$promise.then(function() {
						$scope.updateGeometry();
					})
				});


				$scope.afterReinforcementChange = function(data, action) {
					if (action == 'edit') {
						for (var i = 0; i < data.length; i++) {
							// $scope.a.reinforcement[data[i][0]][data[0][1]] = data[i][3];
							validateReinforcement(data[i][0]);

						}
					}
				}

				$scope.reinforcementRenderer = function(hotInstance, td, row, col, prop, value, cellProperties) {

					$scope.a.$promise.then(function() {

						var elem = angular.element(td);
						if ($scope.a.reinforcement[row] != undefined) {
							if ($scope.a.reinforcement[row].valid != undefined) {
								if ($scope.a.reinforcement[row].valid) {
									elem.css("background-color", "#00FF00");
								} else {
									elem.css("background-color", "#FF0000");
								}
							}
						}
						td.innerHTML = value;

					})
				}

				$scope.afterActionsChange = function(data, action){
					if (action == 'edit') {
						for (var i = 0; i < data.length; i++) {
							if (data[i][1] == "n" || data[i][1] == "my" || data[i][1] == "mz"){
								$scope.a.actions.uls[data[i][0]].safe = null;
							}
						}
					}
				}

				var actionsRenderer = function(hotInstance, td, row, col, prop, value, cellProperties, state) {
					$scope.a.$promise.then(function() {
						var elem = angular.element(td);

						//validate safety - apply to all line
						if ($scope.a.actions[state][row] != undefined) {
							if ($scope.a.actions[state][row].safe != undefined) {
								if ($scope.a.actions[state][row].safe == "OK") {
									elem.css("background-color", "#00FF00");
								} else {
									elem.css("background-color", "#FF0000");
								}
							}
						}

						//validate id duplication - apply to cell
						if (prop == "id"){
							if ($scope.a.actions[state][row] != undefined) {
								if ($scope.a.actions[state][row].id != undefined || $scope.a.actions[state][row].id != null) {
									if (!validateID(state, $scope.a.actions[state][row].id, row)) {
										elem.css("background-color", "#FFF063");
									} 
								}
							}

						}
						td.innerHTML = value;
					});
				}

				$scope.actionsULSRenderer = function(hotInstance, td, row, col, prop, value, cellProperties) {
					actionsRenderer(hotInstance, td, row, col, prop, value, cellProperties, "uls");
				}

				$scope.actionsCharRenderer = function(hotInstance, td, row, col, prop, value, cellProperties) {
					actionsRenderer(hotInstance, td, row, col, prop, value, cellProperties, "char");
				}

				$scope.actionsFreqRenderer = function(hotInstance, td, row, col, prop, value, cellProperties) {
					actionsRenderer(hotInstance, td, row, col, prop, value, cellProperties, "freq");
				}

				$scope.actionsQPRenderer = function(hotInstance, td, row, col, prop, value, cellProperties) {
					actionsRenderer(hotInstance, td, row, col, prop, value, cellProperties, "qp");
				}

				var validateID = function(state, id, row) {
					for (var i = 0; i < $scope.a.actions[state].length; i++) {
						if ($scope.a.actions[state][i].id == id && row != i) {
							return false;
						}
					}
					return true;
				}

				var validateReinforcement = function(idx) {
					if ($scope.a.reinforcement[idx].y && $scope.a.reinforcement[idx].z) {
						if ($scope.a.section_type != "CIRC") {

							var closest = PolyK.ClosestEdge($scope.polygon, $scope.a.reinforcement[idx].y, $scope.a.reinforcement[idx].z);
							var inside = PolyK.ContainsPoint($scope.polygon, $scope.a.reinforcement[idx].y, $scope.a.reinforcement[idx].z);
							var abs_closest = parseFloat(Math.abs(closest.dist).toFixed(10));
							var half_rein = $scope.a.reinforcement[idx].diam / (2 * 1000);
							half_rein = parseFloat(Math.abs(half_rein).toFixed(10));;
							if (inside && abs_closest > half_rein) {
								$scope.a.reinforcement[idx].valid = true;
							} else {
								$scope.a.reinforcement[idx].valid = false;
							}
						} else {
							var distToCenter = Math.sqrt(Math.pow($scope.a.reinforcement[idx].y, 2) + Math.pow($scope.a.reinforcement[idx].z, 2));
							var radius = Math.abs($scope.a.geometry.diam / 2);
							var distToBorder = radius - distToCenter - $scope.a.reinforcement[idx].diam / (2 * 1000);
							if (distToBorder < 0) {
								$scope.a.reinforcement[idx].valid = false;
							} else {
								$scope.a.reinforcement[idx].valid = true;
							}
						}
					} else {
						$scope.a.reinforcement[idx].valid = undefined;
					}
				}

				$scope.submitUpdateForm = function(isValid) {
					if (isValid) {
						$scope.a.uls_curve_index = null;
						Section.update($scope.a, section, function(data) {
							$scope.a = data;
							Notification.success('Section saved');
						}, function(response) {
							Notification.error(response.data.detail);
						});
					}
				}

				$scope.deleteSection = function() {
					Section.remove(section, function() {
						for (var i = 0; i < $scope.sections.length; i++) {
							if ($scope.sections[i].id == section.id) {
								$scope.sections.splice(i, 1);
								break;
							}
						}
						Notification.success('Section deleted');
						$state.transitionTo('sections');
					}, function(response) {
						Notification.error(response.data.detail);
					});
				}



			}],
		});

}]);