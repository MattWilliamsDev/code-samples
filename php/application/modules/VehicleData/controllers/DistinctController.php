<?php


class VehicleData_DistinctController extends BaseController {

	public function actionIndex() {
		return Model::factory('VehicleData_DistinctVehicle')->distinct_years();
	}

	public function actionMakes($year) {
		return Model::factory('VehicleData_DistinctVehicle')->distinct_makes($year);
	}

	public function actionModels($year, $make) {
		return Model::factory('VehicleData_DistinctVehicle')->distinct_models($year, $make);
	}

	public function actionValue($year, $make, $model) {
		$vehicle = Model::factory('VehicleData_DistinctVehicle')
			->vehicle($year, $make, $model)
			->find_one();
		
		if ($vehicle) {
			return array(
				'value' => $vehicle->Value, 
				'basedOn' => $vehicle->BasedOn
				);
		}

		return Response::make(array('error' => 'Vehicle Not Found'), 404);

	}
}
