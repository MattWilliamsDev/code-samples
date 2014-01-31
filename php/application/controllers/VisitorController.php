<?php

class VisitorController extends BaseController
{
    public function actionCreate( $job, $gurl )
    {
        if ( !$job ) {
            return Response::make( $this->render('error'), 404 );
        }

        $time = time();
        $model = Model::factory('CustomerPrizeSelection');
        $temp = $job . '-' . $time;

        try {
            $model->create()->createVisitor( $job, $gurl, $time );
        } catch ( Exception $e ) {
            die ( $e->getMessage() );
        }

        $visitor = $model->where('CustomerKey', $temp)->find_one()->as_array();

        return Response::make(json_encode( $visitor ), 200 );
    }

    public function actionRecent( $job )
    {
        $entrants = array();
        if (!$job)
            return Response::make( $this->render('error'), 404 );

        $model = Model::factory('CustomerPrizeSelection');

        try {
            $recent = $model->table_alias('t1')
                ->join('tcustomer', array('t1.CustomerKey', '=', 't2.CustomerKey'), 't2')
                ->where('t1.jobs_no', $job)
                ->where('t1.tcusprizesel_group', '1')
                ->where_not_equal('t2.CustomerFirstName', '')
                ->where_not_equal('t2.CustomerLastName', '')
                ->where_not_equal('t2.CustomerCity', '')
                ->where_not_equal('t2.CustomerState', '')
                ->order_by_desc('t1.tcusprizesel_ts')
                ->order_by_desc('t1.tcusprizesel_no')
                ->limit(20)
                ->find_result_set();
        } catch (Exception $e) {
            die( $e->getMessage() );
        }

        foreach ($recent as $row) {
            $customer = Model::factory('Customer');
            $_data = $customer->where('jobs_no', $job)
                ->where('CustomerKey', $row->CustomerKey)
                ->find_one();

            $data = $_data->as_array();
            $rowData = $row->as_array();
            $updated = array_merge($rowData, $data);

            // if ($updated['CustomerFirstName'] == '' || $updated['CustomerLastName'] == '' || $updated['CustomerCity'] == '' || $updated['CustomerState'] == '')
            
            $finalized = array(
                'fname' => $updated['CustomerFirstName'],
                'lname' => $updated['CustomerLastName'],
                'city'  => $updated['CustomerCity'],
                'state' => $updated['CustomerState'],
                'time'  => $updated['tcusprizesel_ts'],
                'type'  => 'entered'
                );

            try {
                array_push( $entrants, $finalized );
            } catch (Exception $e) {
                var_dump( $e->getMessage() );
            }
        }

        return Response::make( json_encode( $entrants ), 200 );
    }

    public function actionTest( $job, $gurl)
    {
        return Response::make( array(
            'job'   => $job,
            'gurl'  => $gurl
            ), 200 );
    }
}