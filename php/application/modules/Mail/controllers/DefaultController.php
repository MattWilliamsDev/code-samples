<?php

class Mail_DefaultController extends BaseController
{

	public function actionIndex( $jobs_no, $purl )
    {

        require_once FW_APP_ROOT . '/lib/functions.php';

        $TEST_JOBS = array(87011);

		// TODO: Bring in a templating engine
		// TODO: Provide front-end with data necessary to render job
        $this->setViewVar('jobs_no', $jobs_no);
        $this->setViewVar('purl', $purl);
        $this->setViewVar('guid', createGuid());     
        
        /** 
         * Run Lookup by PURL
         */
        try {
            $customer = Model::factory('Customer')
                ->table_alias('t1')
                /*->join('tcusquestions', array('t1.CustomerKey', '=', 't2.CustomerKey'), 't2')*/
                /*->join('tcusprizesel', array('t1.CustomerKey', '=', 't3.CustomerKey'), 't3')*/
                ->inner_join('tcustomerext', array('t4.CustomerKey', '=', 't1.CustomerKey'), 't4')
                ->where('t1.jobs_no', $jobs_no)
                /*->where('t3.tcusprizesel_group', '1')*/
                ->where('t4.PurlBase', $purl)
                ->find_one();
        } catch (Exception $e) {
            return Response::make( $e->getMessage(), 400 );
        }

        /**
         * If tcusprizesel_no doesn't exist on tcustomer table in DB, set it
         */
        try {
            $edit = Model::factory('Customer')
                ->where('jobs_no', $jobs_no)
                ->where('CustomerKey', $customer->CustomerKey)
                ->find_one();
        } catch (Exception $e) {
            die($e->getMessage());
        }
        
        if (!$edit->tcusprizesel_no) {
            $edit->tcusprizesel_no = $customer->tcusprizesel_no;
            try {
                $edit->save();
            } catch (Exception $e) {
                return Response::make( $e->getMessage(), 400 );
            }
        }

        try {
            $client = Client::find( $jobs_no );
        } catch (Exception $e) {
            return Response::make( $e->getMessage(), 400 );
        }

        if(in_array($jobs_no,$TEST_JOBS)) {
            $lastvisit = ORM::for_table('tcusprizesel')->raw_query("SELECT * 
                FROM tcusprizesel
                WHERE jobs_no = :job
                ORDER BY tcusprizesel_no DESC
                ", array('job' => $jobs_no))->find_one();  
            if($lastvisit['tcusprizesel_defaulttext'] == 'welcome') {
                $this->setViewVar('route','questions'); 
            } else {
                $this->setViewVar('route','');   
            }      
        }

        /**
         * @todo Add a check to `tcusquestions` (CustomerQuestions model) for existing rows for this customer.
         *       If none, add an entry, then add it all to the customer data that is returned.
         */
        try {
            $exists = CustomerQuestions::customer_exists($customer->CustomerKey);
        } catch (Exception $e) {
            return Response::make( $e->getMessage(), 400 );
        }

        if ($exists === false) {
            // Create Record in tcusquestions
            $_questions = Model::factory('CustomerQuestions');
            $ques = $_questions->create();
            $ques->jobs_no = $jobs_no;
            $ques->CustomerKey = $customer->CustomerKey;
            $ques->tcusquestions_first = $customer->CustomerFirstNameChange ? $customer->CustomerFirstNameChange : $customer->CustomerFirstName;
            $ques->tcusquestions_last = $customer->CustomerLastNameChange ? $customer->CustomerLastNameChange : $customer->CustomerLastName;
            $ques->tcusquestions_email = $customer->CustomerEmail ? $customer->CustomerEmail : '';

            try {
                $ques->save();
            } catch (Exception $e) {
                return Response::make( $e->getMessage(), 400 );
            }

            // Create record in tcusprizesel
            $_prizesel = Model::factory('CustomerPrizeSelection');
            $prize = $_prizesel->create();
            $prize->jobs_no = $jobs_no;
            $prize->CustomerKey = $customer->CustomerKey;
            $prize->tcusprizesel_group = '1';

            try {
                $prize->save();
            } catch (Exception $e) {
                return Response::make( $e->getMessage(), 400 );
            }
        } 
        
        try {
            $cust = Model::factory('Customer')
                ->allData($customer->CustomerKey)
                ->find_one();
        } catch (Exception $e) {
            return Response::make( $e->getMessage(), 400 );
        }
        
        $this->setViewVar('customer', $cust->as_array());
        $this->setViewVar('subjobs_no', (int) $cust->subjobs_no);
        $this->setViewVar('client', $client);
	
        return $this->render('../modules/Mail/views/index');
	}

}