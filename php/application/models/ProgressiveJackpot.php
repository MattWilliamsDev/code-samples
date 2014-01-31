<?php

class ProgressiveJackpot extends Model
{

	public static $_table = 'BLPJACKPOT';
	public static $_id_column = 'id';

	public static function current() {
		return Model::factory('ProgressiveJackpot')
			->order_by_desc('ts')
			->find_one();
	}

	public static function currentValue() {
		$current = self::current();
		return $current ? (float) $current->value : null;
	}

	public static function getWinners()
	{
		/*
		 * Removed due to sensitive DB information
		 */
	}

    private function _buildWinnerUrl($value) {
        if (!empty($value)) {
            return 'http://e3.perq.com/images/WINNERS/' . $value;
        }

        return null;
    }

}