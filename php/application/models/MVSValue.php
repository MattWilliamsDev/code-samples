<?php

class MVSValue extends Model {

	public static $_table = 'MVSVALUE';
	public static $_id_column = 'mvsvalue_no';

	public function job() {
		return $this->belongs_to('Job', 'jobs_no');
	}
	
	public function field() {
		return $this->belongs_to('MVSField', 'mvsfield_no');
	}

	public static function filter_field($orm, $field_no) {
		return $orm->where('mvsfield_no', $field_no);
	}

	public static function filter_job($orm, $jobs_no) {
		return $orm->where('jobs_no', $jobs_no);
	}

	public static function filter_subjob($orm, $subjobs_no) {
		return $orm->where('subjobs_no', $subjobs_no);
	}

	public static function filter_tab($orm, $tab) {
		return $orm->where('mvsvalue_tab', $tab);
	}

	public static function filter_subtab($orm, $subtab) {
		return $orm->where('mvsvalue_subtab', $subtab);
	}

	public static function get_value($field_no, $jobs_no, $subjobs_no = null, $tab = null, $subtab = null) {
		$result = Model::factory('MVSValue')
			->job($jobs_no)
			->field($field_no);

		if ($subjobs_no)
			$result = $result->subjob($subjobs_no);
		if ($tab) 
			$result = $result->tab($tab);
		if ($subtab)
			$result = $result->subtab($subtab);

		$value = $result->select('mvsvalue_value')->find_one();

		if ($value) {
			return $value->mvsvalue_value;
		}

		return false;
	}
}
