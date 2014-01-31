<?php

class CustomerPrizeSelection extends Model 
{

	public static $_table = 'tcusprizesel';
	public static $_id_column = 'tcusprizesel_no';

	public function customer() {
		return $this->belongs_to('Customer', 'CustomerKey');
	}

	public function job() {
		return $this->belongs_to('Job', 'jobs_no');
	}

	/**
	 * Record a PURL hit.
	 *
	 * Replaces functions.php\updatePurlHit($job, $key)
	 * 
	 * Usage:
	 *   Model::factory('CustomerPrizeSelection')
	 *     ->create()->setPurlHit($job, $key)->save();
	 *   
	 * @param  [type] $jobs_no     [description]
	 * @param  [type] $customerKey [description]
	 * @return [type]              [description]
	 */
	public function setPurlHit()
	{
		$time = time();
		$this->set( 'tcusprizesel_ts', $time );
		$this->save();

		return $this;
	}

	public function createVisitor( $jobs_no, $gurl, $time )
	{
		$tempKey = $jobs_no . '-' . $time;

		$this->jobs_no = $jobs_no;
		$this->CustomerKey = $tempKey;
		$this->tcusprizesel_text = $gurl;
		$this->tcusprizesel_ts = $time;
		$this->save();

		return $this;
	}

	public static function getPrizeId( $job, $key )
    {
    	$result = $this->where('jobs_no', $job)
            ->where('CustomerKey', $key)
            ->where('tcusprizesel_group', '1')
            ->find_one();

        $id = $result->tcusprizesel_no;

        return $id;
    }

	public function updateKey( $key )
	{
		$this->set('CustomerKey', $key);
		$this->save();

		return $this;
	}
}
