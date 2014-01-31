<?php

class VehicleData_RawController extends BaseController {

	public function actionIndex() {
		return Model::factory('VehicleData_RawVehicle')->distinct_years();
	}

	public function actionMakes($year) {
		return Model::factory('VehicleData_RawVehicle')->distinct_companies($year);
	}

	public function actionModels($year, $make) {
		return Model::factory('VehicleData_RawVehicle')->distinct_categories($year, $make);
	}

	public function actionTrims($year, $make, $model) {
		return Model::factory('VehicleData_RawVehicle')->distinct_models($year, $make, $model);
	}

	public function actionValue($year, $make, $model, $trim, $condition = VehicleData_RawVehicle::CONDITION_AVERAGE) {
		$vehicle = Model::factory('VehicleData_RawVehicle')
			->vehicle($year, $make, $model, $trim, $condition)
			->find_one();

		if ($vehicle) {
			return array(
				'value' => $vehicle->value($condition), 
				'basedOn' => $vehicle->basedOn()
			);
		}

		return Response::make(array('error' => 'Vehicle Not Found'), 404);
	}
}