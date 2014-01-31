<?php

class MVSField extends Model {
	public static $_table = 'MVSFIELD';
	public static $_id_column = 'mvsfield_no';

	// TODO: Constants are specific for Instant Win
	// Add support later for additional template types.
	
	/**
	 * MySQL Field ID's Were Here [Removed for use in code samples for obvious reasons]
	 */
	/*
		...
	 */

	public function values() {
		return $this->has_many('MVSValue', 'mvsfield_no');
	}

	public function value() {
		return $this->has_one('MVSValue', 'mvsfield_no');
	}

	public static function filter_template($orm, $template) {
		return $orm->where('mvsfield_template', $template);
	}

	public static function filter_name($orm, $name) {
		return $orm->where('mvsfield_name', $name);
	}

	public static function get_value($template, $name, $jobs_no, $subjobs_no = null, $tab = null, $subtab = null) {
		$field = Model::factory('MVSField')
			->select('mvsfield_no')
			->template($template)
			->name($name)
			->find_one();

		if ($field) {
			return MVSValue::get_value($field->mvsfield_no, $jobs_no, $subjobs_no, $tab, $subtab);
		}

		return false;
	}
}
