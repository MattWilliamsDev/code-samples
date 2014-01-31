<?php

class CustomerController extends BaseController
{

    public function actionCreate( $jobs_no, $subjobs_no, $key = null, $ts = null )
    {
        require_once FW_APP_ROOT . '/lib/functions.php'; // To utilize legacy functions (in case you're not into the whole brevity thing - the Dude)

        $model = Model::factory('Customer');
        
        if ( !$key ) {
            $key = createCustomerFromGurl( $jobs_no, $subjobs_no );

            $_customer = $model->where('CustomerKey', $key)->find_one();

            foreach ( $_customer->as_array() as $key => $value ) {
                if ($value) {
                    $cust[$key] = $value;
                }
            }

            if (!empty($this->request->get['share']) && is_array($this->request->get['share'])) {
                //save track
                $address = $this->request->getRequestUri();
                $ip = $this->request->server['REMOTE_ADDR'];
                $refer = $this->request->get['share']['ref'];
                
                //text = network that the share came from
                $text = $this->request->get['share']['network'];
                saveTrack($jobs_no, $key, $refer, 1, $text,$ip,$address);
            }
            $cust->createGuid();
            $customer = $cust;

            if ( $customer )
                return Response::make( $customer, 200 );
            else
                return Response::make( $this->render('error'), 404 );
        } else {
            if ( $ts )
                $key = $key . '-' . $ts;

            $tcusprizesel = Model::factory('CustomerPrizeSelection');
            $_visitor = $tcusprizesel->where('CustomerKey', $key)->find_one();
            
            $newCustomer = $model->create();
            
            try {
                $newCustomer->convertVisitor( $_visitor->as_array() );
            } catch (Exception $e) {
                die ( $e->getMessage() );
            }

            // $visitor = $tcusprizesel->where('tcusprizesel_no', $_visitor->tcusprizesel_no)->find_one();
            $visitor = $tcusprizesel->find_one( $_visitor->tcusprizesel_no );
            try {
                $visitor->updateKey( (string) $newCustomer->CustomerKey );
            } catch (Exception $e) {
                die ( $e->getMessage() );
            }

            $results = array(
                'newCustomer'   => $newCustomer->as_array(),
                'newKey'        => $visitor->CustomerKey,
                'visitor'       => $visitor->as_array()
                );

            return Response::make( json_encode( $newCustomer->as_array() ), 200 );
        }
    }

    public function actionView( $key )
    {
        require_once FW_APP_ROOT . '/lib/functions.php'; // To utilize legacy functions (in case you're not into the whole brevity thing - the Dude)

        $params = $this->request;
        $key = $key;

        $_customer = Model::factory('Customer')
            ->with('questions')
            ->find_one( $key );
        
        if (!$_customer) {
            return new Response('false', 404);
        }

        $cust = $_customer->as_array();
        $cust['jobs_no'] = $_customer->jobs_no;
        $cust['CustomerKey'] = $_customer->CustomerKey;

        if ($_customer->questions) {
            foreach ( $_customer->questions->as_array() as $key => $value ) {
                if ($value) {
                    switch ( $key ) {
                        case 'tcusquestions_no':
                            $label = 'id';
                            break;

                        case 'jobs_no':
                        case 'CustomerKey':
                            $label = $key;
                            break;

                        case 'tcusquestions_first':
                            $label = 'firstname';
                            break;

                        case 'tcusquestions_last':
                            $label = 'lastname';
                            break;

                        case 'tcusquestions_phone':
                        case 'tcusquestions_email':
                        case 'tcusquestions_buy':
                        case 'tcusquestions_newused':
                        case 'tcusquestions_year':
                        case 'tcusquestions_make':
                        case 'tcusquestions_model':
                        case 'tcusquestions_value':
                        case 'tcusquestions_vehicle':
                        case 'tcusquestions_location':
                        case 'tcusquestions_appt':
                        case 'tcusquestions_appttime':
                        case 'tcusquestions_apptconfirm':
                        case 'tcusquestions_ts':
                        case 'tcusquestions_question1':
                        case 'tcusquestions_question2':
                        case 'tcusquestions_question3':
                        case 'tcusquestions_question4':
                        case 'tcusquestions_q1id':
                        case 'tcusquestions_q2id':
                        case 'tcusquestions_q3id':
                        case 'tcusquestions_q4id':
                            $label = str_replace('tcusquestions_', '', $key);
                            break;
                    }
                    $cust[$label] = $value;
                }
            }
        }

        // $customer = $_customer->as_array();
        $customer = $cust;

        if ( $customer )
            return Response::make( $customer, 200 );
        else
            return Response::make( $this->render('error'), 404 );
    }
    
}