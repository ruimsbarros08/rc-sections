var app = angular.module('app', ['ngResource', 'ui.router', 'ngHandsontable', 'ui-notification', 'ui.bootstrap']);

app.factory('Section', ['$resource', function($resource) {
	return $resource('/api/sections/:id/', null, {
		'update': {
			method: 'PUT'
		}
	});
}]);

app.config(function($locationProvider, $urlRouterProvider, $stateProvider, $resourceProvider, $httpProvider, NotificationProvider) {
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
			controller: function($scope, $state) {


			},
		})
		.state('sections', {
			url: "/sections/",
			templateUrl: "static/partials/sections.html",
			resolve: {
				sections: function(Section) {
					return Section.query();
				},
			},
			controller: function($scope, $state, sections, Section, Notification, $window, $uibModal) {
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
										if (response.status === 401 || response.status === 403) {
											$window.open('', "_self");
										} else {
											Notification.error('Error');
										};
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
			},
		})
		.state('sections.detail', {
			parent: 'sections',
			url: ":id",
			templateUrl: "static/partials/sections.detail.html",
			resolve: {
				section: function(Section, $stateParams) {
					return Section.get({
						id: $stateParams.id
					});
				},
			},
			controller: function($scope, $state, section, Section, Notification, $window) {
				$scope.a = section;
				$scope.polygon;

				$scope.concerte_classes = [{
					id: "C15_20",
					label: "C15/20"
				}, {
					id: "C20_25",
					label: "C20/25"
				}, {
					id: "C25_30",
					label: "C25/30"
				}, {
					id: "C30_35",
					label: "C30/35"
				}, ];
				$scope.steel_classes = ["A400", "A500"];


				$scope.updateGeometry = function() {
					if ($scope.a.section_type == "RECT") {
						$scope.polygon = [0, 0, $scope.a.geometry.width, 0, $scope.a.geometry.width, $scope.a.geometry.height, 0, $scope.a.geometry.height];
					}

					for (var i = 0; i < $scope.a.reinforcement.length; i++) {
						updateReinforcementTable(i);
					}
				}

				$scope.a.$promise.then(function() {
					$scope.updateGeometry();
				});

				$scope.afterReinforcementChange = function(data, action) {
					if (action == 'edit') {
						for (var i = 0; i < data.length; i++) {
							$scope.a.reinforcement[data[i][0]][data[0][1]] = data[i][3];
							console.log($scope.polygon, $scope.a.reinforcement[data[i][0]].y, $scope.a.reinforcement[data[i][0]].z);
							updateReinforcementTable(data[i][0]);
						}
					}

				}

				var updateReinforcementTable = function(idx) {
					if ($scope.a.reinforcement[idx].y && $scope.a.reinforcement[idx].z) {
						$scope.a.reinforcement[idx].valid = PolyK.ContainsPoint($scope.polygon, $scope.a.reinforcement[idx].y / 1000, $scope.a.reinforcement[idx].z / 1000);
					}
				}

				$scope.afterUlsChange = function(data, action) {
					if (action == 'edit') {
						for (var i = 0; i < data.length; i++) {
							$scope.a.actions.uls[data[i][0]][data[0][1]] = data[i][3];
						}
					}
				}
				$scope.afterCharChange = function(data, action) {
					if (action == 'edit') {
						for (var i = 0; i < data.length; i++) {
							$scope.a.actions.char[data[i][0]][data[0][1]] = data[i][3];
						}
					}
				}
				$scope.afterFreqChange = function(data, action) {
					if (action == 'edit') {
						for (var i = 0; i < data.length; i++) {
							$scope.a.actions.freq[data[i][0]][data[0][1]] = data[i][3];
						}
					}
				}
				$scope.afterQpChange = function(data, action) {
					if (action == 'edit') {
						for (var i = 0; i < data.length; i++) {
							$scope.a.actions.qp[data[i][0]][data[0][1]] = data[i][3];
						}
					}
				}

				$scope.submitUpdateForm = function(isValid) {
					if (isValid) {
						Section.update($scope.a, section, function() {
							Notification.success('Section saved');
						}, function() {
							if (response.status === 401 || response.status === 403) {
								$window.open('', "_self");
							} else {
								Notification.error('Unexpected error occured');
							};
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
					}, function() {
						Notification.error('Unexpected error occured');
					});
				}



			},
		});

});

