<?php

class BLPSession extends Model
{

	public static $_table = 'BLPSESSION';
	public static $_id_column = 'blpsession_no';

	public function customer() {
		return $this->belongs_to('Customer', 'CustomerKey');
	}

	public function job() {
		return $this->belongs_to('Job', 'jobs_no');
	}
	
}
