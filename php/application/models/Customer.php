<?php

class Customer extends Model {

	public static $_table = 'tcustomer';
	public static $_id_column = 'CustomerKey';

	public function prizeSelection() {
		return $this->has_one('CustomerPrizeSelection', 'CustomerKey');
	}

	public function questions() {
		return $this->has_one('CustomerQuestions', 'CustomerKey');
	}

	public static function filter_allData($orm, $key)
	{
		$job = substr($key, 0, 5);
		return $orm->table_alias('t1')
			->join('tcusquestions', array('t1.CustomerKey', '=', 't2.CustomerKey'), 't2')
            ->join('tcusprizesel', array('t1.CustomerKey', '=', 't3.CustomerKey'), 't3')
            ->inner_join('tcustomerext', array('t4.CustomerKey', '=', 't1.CustomerKey'), 't4')
            ->where('t1.jobs_no', $job)
            ->where('t1.CustomerKey', $key)
            ->where('t3.tcusprizesel_group', '1');
	}

	/**
	 * Create a new customer from a GURL visit.
	 *
	 * Replaces functions.php\createCustomerFromGurl($job, $subjob)
	 * 
	 * Usage:
	 *   Model::factory('Customer')
	 *     ->createFromGurl($jobs_no, $subjobs_no)
	 *     ->save();
	 *     
	 * @param  int $jobs_no    
	 * @param  int $subjobs_no 
	 * @return Customer
	 */
	public function createFromGurl($jobs_no, $subjobs_no)
	{
		// $this->create();
		$this->jobs_no = $jobs_no;
		$this->subjobs_no = $subjobs_no;

		// get last customer key
		$lastKey = ORM::for_table(self::$_table)
			->where('jobs_no', $jobs_no)
			->max('CustomerKey');

		$customerKey = $lastKey + 1;

		$this->CustomerKey = $customerKey;
		$this->TestRecord = 'F';

		return $this;

		// TODO override save() to add to INSERTs: 
		//   ON DUPLICATE KEY UPDATE CustomerKey=CustomerKey+1
	}

	public function convertVisitor( $visitor )
	{
		$orm = ORM::for_table(self::$_table);
		$this->jobs_no = $visitor['jobs_no'];
		$this->subjobs_no = isset($visitor['subjobs_no']) ? $visitor['subjobs_no'] : '1';
		$tempKey = $visitor['CustomerKey'];

		$this->TestRecord = 'F';
		$this->tcusprizesel_no = $visitor['tcusprizesel_no'];

		// Save Converted Visitor
		try {
			$result = $this->saveConvertedVisitor();
		} catch (Exception $e) {
			die ( $e->getMessage() );
		}

		return $this;
	}

	protected function saveConvertedVisitor()
	{
		$job = $this->jobs_no;
		$orm = ORM::for_table(self::$_table);
		$table = self::$_table;

		try {
			$lastKey = $this->getLastKey($job);
		} catch (Exception $e) {
			die ( $e->getMessage() );
		}
		$newKey = $lastKey + 1;
		
		// Insert New Customer Record
		try {
			$this->set('jobs_no', $job);
			$this->set('CustomerKey', $newKey);
			$this->set('TestRecord', 'F');
			$this->set('Scanned', 'F');
			$this->save();

			/**
			 * This is a good place to start if we decide we need to add the ON DUPLICATE KEY UPDATE...
			 */
			// $result = ORM::for_table($table)->raw_execute(
			// 	"INSERT INTO {$table} (jobs_no, subjobs_no, CustomerKey, TestRecord, Scanned)
			// 	VALUES (:job, :subjob, :key, :test, :scanned)
			// 	ON DUPLICATE KEY UPDATE CustomerKey = CustomerKey + 1",
			// 	array(
			// 		// ':table'	=> $table,
			// 		':job'		=> $job,
			// 		':subjob'	=> $this->subjobs_no,
			// 		':key'		=> $newKey,
			// 		':test'		=> 'T',
			// 		':scanned'	=> 'T'
			// 		// ':newKey'	=> $newKey
			// 		)
			// 	);
				
		} catch (Exception $e) {
			die ( $e->getMessage() );
		}
		
		return $this;
	}

	public function getLastKey( $job )
	{
		$orm = ORM::for_table(self::$_table);
		
		$result = $orm
			->where('jobs_no', $job)
			->order_by_expr('LENGTH(`CustomerKey`) DESC, `CustomerKey` DESC')
			->max('CustomerKey');

		return $result ? $result : str_pad($job, 11, '0');
	}

	public static function filter_job($orm, $jobs_no) {
		return $orm->where('jobs_no', $jobs_no);
	}

	/**
	 * Filter Customers by CustomerKey
	 *
	 * Replaces functions.php\getCustomerByKey
	 * 
	 * Usage:
	 *   Model::factory('Customer')->key($customerKey)->find_one()
	 *   
	 * @param  string $key 
	 */
	public static function filter_key($orm, $key) {
		return $orm->where('CustomerKey', $key);
	}

	/**
	 * Find a customer by PURL.
	 *
	 * Replaces functions.php\getCustomerByPurl($job, $purl)
	 * 
	 * @param int    $jobs_no
	 * @param string $purl
	 */

	public static function filter_purl($orm, $jobs_no, $purl)
	{
		return $orm->inner_join(
				'tcustomerext', 
				array('tcustomerext.CustomerKey', '=', 'tcustomer.CustomerKey'))
			->where('jobs_no', $jobs_no)
			->where('tcustomerext.PurlBase', $purl);
	}

	public function firstName() {
		return $this->CustomerFirstNameChange ?
			$this->CustomerFirstNameChange : $this->CustomerFirstName;
	}

	public function lastName() {
		return $this->CustomerLastNameChange ?
			$this->CustomerLastNameChange : $this->CustomerLastName;
	}
}