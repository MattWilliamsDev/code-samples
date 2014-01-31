<?php

class Job extends Model {
	public static $_table = 'JOBS';
	public static $_id_column = 'jobs_no';

	public function customers() {
		return $this->has_many('Customer', 'jobs_no');
	}

	public static function find_by_gurl($gurl) {
		$result = Model::factory('MVSValue')
			->field(MVSField::DIRS)
			->select_many('jobs_no', 'subjobs_no')
			->where_like('mvsvalue_value', '%*' . $gurl . '*%')
			->with('job')
			->order_by_desc('mvsvalue_timestamp')
			->find_one();

		if ($result) {
			return $result->job;
		}

		return null;
	}

	public function mvsValues(array $fields = null) {
		$values = $this->has_many('MVSValue', 'jobs_no');
		
		if ($fields) {
			$values = $values->where_in('mvsfield_no', $fields);
		}

		return $values;
	}

	public function getMVSValues(array $fields = null) {
		// TODO: pull in MVSFIELD.mvsfield_default values
		// when value is not configured.
		$result = array_fill_keys($fields, null);
		
		foreach ($this->mvsValues($fields)->find_many() as $v) {
			$result[$v->mvsfield_no] = $v->mvsvalue_value;
		}
	
		return $result;
	}
}