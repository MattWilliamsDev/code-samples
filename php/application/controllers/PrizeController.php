<?php

class PrizeController extends BaseController
{

    public function actionUpdate( $job, $key, $route = 'welcome' )
    {
        if ( !$job ) {
            return Response::make( 'No Job # Given', 404 );
        }
        
        $model = Model::factory('CustomerPrizeSelection');

        $data = $model->where( 'jobs_no', $job )
            ->where( 'CustomerKey', $key )
            ->where( 'tcusprizesel_group', '1' )
            ->find_one();

        // Create a new record if there isn't one returned to us
        if (!$data) {
            $data = $model->create(); // Create
            $data->jobs_no = $job;
            $data->CustomerKey = $key;
            $data->tcusprizesel_group = '1';           
        } 
        
        $time = (string) time();
        $data->tcusprizesel_ts = $time;
        $data->tcusprizesel_defaulttext = $route;
        
        try {
            $data->save();
        } catch ( Exception $e ) {
            die ( $e->getMessage() );
        }

        $updated = $model->where( 'jobs_no', $job )
            ->where( 'CustomerKey', $key )
            ->where( 'tcusprizesel_group', '1' )
            ->find_one();

        return Response::make( json_encode( $updated->as_array() ), 200 );
    }

    public function actionView( $job, $key )
    {
        $model = Model::factory('CustomerPrizeSelection');

        $result = $model->where( 'jobs_no', $job )
            ->where( 'CustomerKey', $key )
            ->where( 'tcusprizesel_group', '1' )
            ->find_one();

        return Response::make( json_encode( $result->as_array() ), 200 );
    }

    public function actionTest( $job, $gurl)
    {
        return Response::make( array(
            'job'   => $job,
            'gurl'  => $gurl
            ), 200 );
    }

}