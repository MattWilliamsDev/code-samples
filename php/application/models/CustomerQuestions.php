<?php

class CustomerQuestions extends Model
{
	const DUPLICATE_COLUMN_CODE = '42S21';
	public static $_table = 'tcusquestions';
	public static $_id_column = 'CustomerKey';

	public static function installer()
	{
		$dbh = ORM::get_db();
		
		$fields = array(
			'tcusquestions_year'		=> "INT(4) NULL",
			'tcusquestions_make'		=> "VARCHAR(35) NULL",
			'tcusquestions_model'		=> "VARCHAR(75) NULL",
			'tcusquestions_value'		=> "INT(7) NULL",
			'tcusquestions_location'	=> "VARCHAR(50) NULL",
			'tcusquestions_question1'	=> "VARCHAR(50) NULL",
			'tcusquestions_question2'	=> "VARCHAR(50) NULL",
			'tcusquestions_question3'	=> "VARCHAR(50) NULL",
			'tcusquestions_question4'	=> "VARCHAR(50) NULL",
			'tcusquestions_q1id' 		=> "INT(7) NULL",
			'tcusquestions_q2id' 		=> "INT(7) NULL",
			'tcusquestions_q3id' 		=> "INT(7) NULL",
			'tcusquestions_q4id' 		=> "INT(7) NULL"
			);

		foreach ( $fields as $column => $attributes ) {
			$_table = self::$_table;

			$q = "ALTER TABLE `{$_table}`
			ADD `{$column}` {$attributes}";

			try {
				$result = $dbh->query( $q );
			} catch ( Exception $e ) {
				if ( $e->getCode() == self::DUPLICATE_COLUMN_CODE ) {
					continue;
				} else {
					return false;
				}
			}
		}

		return true;
	}

	public function job() {
		return $this->belongs_to('Job', 'jobs_no');
	}

	public function customer() {
		return $this->belongs_to('Customer', 'CustomerKey');
	}

	public static function customer_exists($key)
	{
		$job = substr($key, 0, 5);
		try {
			$data = ORM::for_table(self::$_table)->where('jobs_no', $job)->where('CustomerKey', $key)->find_one();
		} catch (Exception $e) {
			throw new Exception($e->getMessage());
		}

		if ($data && count($data) > 0) {
			return true;
		} else {
			return false;
		}
	}

	public static function filter_job($orm, $jobs_no) {
		return $orm->where('jobs_no', $jobs_no);
	}
	
	public static function filter_email($orm, $email) {
		return $orm->where('tcusquestions_email', $email);
	}

	public function saveData( $fields )
	{
		foreach ( $fields as $f => $v ) {
			if ($f != '' && $v != '')
				$this->$f = $v;

		try {
			$this->save();
		} catch ( Exception $e ) {
			throw new Exception( $e->getMessage() );
		}

		return $this;
	}
}