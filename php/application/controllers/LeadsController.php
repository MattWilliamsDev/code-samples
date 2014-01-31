<?php

class LeadsController extends BaseController
{

    const DATE_FORMAT = 'mdY'; // ex: 01212014
    const TIME_FORMAT = 'g:ia T'; // ex: 1:15pm EST

    public function actionSave($key = null)
    {
        $params = $this->request;

        if (!$key) {
            if ($params->key)
                $key = $params->key;
            else
                throw new Exception( 'No Customer Key Provided' );
        } else {
            $job = substr($key, 0, 5);
            $_model = Model::factory('LeadsLoad');
            $_customer = Model::factory('Customer');

            // Get the customer from the job # & key
            $customer = $_customer->job($job)->key($key)->find_one();

            // Check if exists in LEADS_LOAD table
            $existing = $_model->job($job)->key($key)->find_one();
            if ($existing && count($existing) > 0) {
                // Record exists
                $lead_no = $existing->lead_no;
                $lead = $existing;
            } else {
                $lead = $_model->create();
            }

            // Set the LEADS_LOAD info for use later
            try {
                $lead->set('jobs_no', $job);
                $lead->set('CustomerKey', $key);
                $lead->set('website_name', 'getfast');
                $lead->set('date', date(self::DATE_FORMAT));
                $lead->set('time', date(self::TIME_FORMAT));
                $lead->set('fname', $customer->CustomerFirstNameChange ? $customer->CustomerFirstNameChange : $customer->CustomerFirstName);
                $lead->set('lname', $customer->CustomerLastNameChange ? $customer->CustomerLastNameChange : $customer->CustomerLastName);
                $lead->set('cur_address', $customer->CustomerAddressChange ? $customer->CustomerAddressChange : $customer->CustomerAddress);
                $lead->set('cur_city', $customer->CustomerCityChange ? $customer->CustomerCityChange : $customer->CustomerCity);
                $lead->set('cur_state', $customer->CustomerStateChange ? $customer->CustomerStateChange : $customer->CustomerState);
                $lead->set('cur_zip', $customer->CustomerZIPChange ? $customer->CustomerZIPChange : $customer->CustomerZIP);
                $lead->set('homephone', $customer->CustomerPhone);
                $lead->set('email_address', $customer->CustomerEmail);
                $lead->save();
            } catch (Exception $e) {
                return Response::make($e->getMessage(), 400);
            }
            
            return Response::make( json_encode($lead->as_array()), 200 );
        }
    }
    
}