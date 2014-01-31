<?php

class BLPTiming extends Model {

	public static $_table = 'BLPTIMING';
	public static $_id_column = 'blptiming_no';

	public function customer() {
		return $this->belongs_to('Customer', 'CustomerKey');
	}

	public function job() {
		return $this->belongs_to('Job', 'jobs_no');
	}
	
	/**
	 *
	 * Replaces functions.php\createTimingEntry()
	 *
	 * Usage:
	 *
	 *   Model::factory('BLPTiming')->createEntry(...)->save();
	 * 
	 * @param  string $panel   
	 * @param  int    $jobs_no
	 * @param  string $key     Customer Key
	 * @param  string $guid    
	 * @param  int    $time 
	 */
	public static function createEntry($panel, $jobs_no, $key, $guid = null, $time = null) {
		$this->create()->set(array(
			'jobs_no' => $jobs_no,
			'CustomerKey' => $key,
			'panel_name' => $panel,
			'panel_timing' => $time ? $time : mktime()
		));

		if ($guid) {
			$this->blptiming_guid = $guid;
		} else {
			$this->set_expr('blptiming_guid', 'UUID()');
		}

		return $this;
	}
}
