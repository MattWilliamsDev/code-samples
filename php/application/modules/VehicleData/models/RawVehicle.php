<?php

class VehicleData_RawVehicle extends Model {
	public static $_table = 'rawvehicledata';
	public static $_id_column = 'rawvehicledata_no';

	const CONDITION_ROUGH = 'Rough';
	const CONDITION_AVERAGE = 'Average';
	const CONDITION_CLEAN = 'Clean';

	public static function filter_company($orm, $company) {
		return $orm->where('Company', $company);
	}

	public static function filter_make($orm, $make) {
		return $orm->filter_company($orm, $make);
	}

	public static function filter_category($orm, $category) {
		return $orm->where('ModelCat', $category);
	}

	public static function filter_model($orm, $model) {
		return $orm->where('Model', $model);
	}

	public static function filter_year($orm, $year) {
		return $orm->where('ModelYear', $year);
	}

	public static function filter_distinct_years($orm) {
		$years = $orm->select('ModelYear')
			->distinct()
			->order_by_desc('ModelYear')
			->find_many();

		$result = array();
		foreach ($years as $y) {
			$result[] = $y->ModelYear;
		}

		return $result;
	}

	public static function filter_distinct_companies($orm, $year) {
		$companies = $orm->select('Company')
			->distinct()->year($year)
			->order_by_asc('Company')
			->find_many();

		$result = array();
		foreach ($companies as $c) {
			$result[] = $c->Company;
		}

		return $result;
	}

	public static function filter_distinct_categories($orm, $year, $company) {
		$categories = $orm->select('ModelCat')
			->distinct()
			->year($year)
			->company($company)
			->order_by_asc('ModelCat')
			->find_many();

		$result = array();
		foreach ($categories as $c) {
			$result[] = $c->ModelCat;
		}

		return $result;
	}

	public static function filter_distinct_models($orm, $year, $company, $category) {
		$models = $orm->select('Model')
			->distinct()
			->year($year)
			->company($company)
			->category($category)
			->order_by_asc('Model')
			->find_many();

		$result = array();
		foreach ($models as $m) {
			$result[] = $m->Model;
		}

		return $result;
	}

	public static function filter_vehicle($orm, $year, $company, $category, $model) {
		return $orm->year($year)->company($company)->category($category)->model($model);
	}

	public function basedOn() {
		return sprintf(
			'%s %s %s %s', 
			$this->ModelYear, 
			$this->Company, 
			$this->ModelCat, 
			$this->Model
		);
	}

	public function value($condition = self::CONDITION_AVERAGE) {
		return $this->{$condition.'TradeIn'};
	}
}
