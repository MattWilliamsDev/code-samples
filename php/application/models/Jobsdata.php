<?php

class Jobsdata extends Model {

	public static $_table = 'JOBSDATA';
	public static $_id_column = 'jobsdata_no';

	public function job() {
		return $this->belongs_to('Job', 'jobs_no');
	}
	
	public function field() {
		return $this->belongs_to('Jobsdata', 'jobsdata_no');
	}

	public static function filter_field($orm, $jobsdata_no) {
		return $orm->where('jobsdata_no', $jobsdata_no);
	}

	public static function filter_job($orm, $jobs_no) {
		return $orm->where('jobs_no', $jobs_no);
	}

	public static function filter_subjob($orm, $subjobs_no) {
		return $orm->where('subjobs_no', $subjobs_no);
	}

	public static function filter_category($orm, $category) {
		return $orm->where('category_no', $category);
	}

	public static function filter_product($orm, $product) {
		return $orm->where('products_no', $product);
	}

	public static function get_bool($jobs_no, $subjobs_no = null, $category = null, $product = null) {
		$result = Model::factory('Jobsdata')
			->job($jobs_no);

		if ($subjobs_no)
			$result = $result->subjob($subjobs_no);
		if ($category) 
			$result = $result->category($category);
		if ($product)
			$result = $result->product($product);

		$value = $result->select('jobsdata_no')->find_one();

		if ($value) {
			return true;
		}

		return false;
	}
}
