<?php

class Leads extends Model
{

    public static $_table = 'LEADS';
    public static $_id_column = 'lead_no';

    public function job()
    {
        return $this->belongs_to('Job', 'jobs_no');
    }

    public function customer()
    {
        return $this->belongs_to('Customer', 'CustomerKey');
    }

    public static function filter_job($orm, $jobs_no)
    {
        return $orm->where('jobs_no', $jobs_no);
    }

    public static function filter_key($orm, $key)
    {
        return $orm->where('CustomerKey', $key);
    }
    
}