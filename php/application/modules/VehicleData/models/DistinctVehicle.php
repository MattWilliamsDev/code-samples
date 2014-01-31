<?php

class VehicleData_DistinctVehicle extends Model {
	public static $_table = 'tdistinctvehicle';
	public static $_id_column = 'BasedOn';

	public static function filter_distinct_years($orm) {
		$years = $orm->select('Year')
			->distinct()
			->order_by_desc('Year')
			->find_many();

		$result = array();
		foreach ($years as $y) {
			$result[] = $y->Year;
		}

		return $result;
	}

	public static function filter_distinct_makes($orm, $year) {
		$makes = $orm->select('Make')
			->distinct()->year($year)
			->order_by_asc('Make')
			->find_many();

		$result = array();
		foreach ($makes as $m) {
			$result[] = $m->Make;
		}

		return $result;
	}

	public static function filter_distinct_models($orm, $year, $make) {
		$models = $orm->select('Model')
			->distinct()->year($year)->make($make)
			->order_by_asc('Model')
			->find_many();

		$result = array();
		foreach ($models as $m) {
			$result[] = $m->Model;
		}

		return $result;
	}

	public static function filter_make($orm, $make) {
		return $orm->where('Make', $make);
	}

	public static function filter_model($orm, $model) {
		return $orm->where('Model', $model);
	}

	public static function filter_year($orm, $year) {
		return $orm->where('Year', $year);
	}

	public static function filter_vehicle($orm, $year, $make, $model) {
		return $orm->year($year)->make($make)->model($model);
	}

	public function __toString() {
		return $this->BasedOn;
	}
}