<?php

class Mail_CustomerController extends BaseController
{

	protected $fieldList = array(
		'key'			=> 'CustomerKey',
		'job'			=> 'jobs_no',
		'prize'			=> '',
		'fname'			=> 'tcusquestions_first',
		'lname'			=> 'tcusquestions_last',
		'email'			=> 'tcusquestions_email',
		'phone'			=> 'tcusquestions_phone',
		'timeframe'		=> 'tcusquestions_buy',
		'newUsed'		=> 'tcusquestions_newused',
		'newused'		=> 'tcusquestions_newused',
		'year'			=> 'tcusquestions_year',
		'make'			=> 'tcusquestions_make',
		'model'			=> 'tcusquestions_model',
		'value'			=> 'tcusquestions_value'
		);

	public function actionSave( $key )
	{
		$exists = false;
		$params = $this->request->post;

		if ($params->job) {
			$job = $params->job;
		} elseif ($params->jobs_no) {
			$job = $params->jobs_no;
		} else {
			$job = substr($key, 0, 5);
		}

		$customer = Model::factory('CustomerQuestions')
			->where( 'jobs_no', $job )
			->where( 'CustomerKey', $key )
			->find_one();		

		if ( $customer ) {
			$exists = true;
		} else {
			$customer = Model::factory('CustomerQuestions')->create();
			$customer->jobs_no = $job;
			$customer->CustomerKey = $key;

			try {
				$customer->save();
			} catch (Exception $e) {
				throw new Error( $e->getMessage );
			}
		}

		if ( $params ) {
			foreach ($params as $k => $value) {
				$fieldName = $this->fieldList[$k];
				switch ( $k ):
					case 'inputCode':
						break;

					case 'CustomerKey':
					case 'jobs_no':
						// $fields[$k] = $value
						break;

					case 'prize':
						break;

					case 'fname':
					case 'lname':
					case 'email':
					case 'phone':
						$fields[$fieldName] = $value;
						break;

					case 'timeframe':
						$times = array( 'none' => 0, 'now' => 1, '3 Months' => 2, '6 Months' => 3, 'Year' => 4 );
						$fields[$fieldName] = $times[$value];
						break;

					case 'newUsed':
					case 'newused':
						$fields[$fieldName] = $value;
						break;

					case 'year':
					case 'make':
					case 'model':
					case 'mileage':
						$fields[$fieldName] = $value;
						break;

					case 'value':
						$fields[$fieldName] = (int) $value;
						break;

					case 'apptDate':
					// 	if ($value != '') {
					// 		$fields['appt'] = true;
					// 	} else {
					// 		$fields['appt'] = false;
					// 	}

					// 	$fields['apptDate'] = $value;
					// 	break;

					case 'apptTime':
					// 	$fields['apptTime'] = $value;
						break;

					default:
						$fields[$k] = $value;
						break;
				endswitch;
			}

			if ($params['year'] && $params['make'] && $params['model']) {
				$fields['tcusquestions_vehicle'] = $params['year'] . ' ' . $params['make'] . ' ' . $params['model'];
				if ($params['value'])
					$fields['tcusquestions_value'] = $params['value'];
			}

			// Save the data to tcusquestions
			try {
				$customer->saveData( $fields );
			} catch (Exception $e) {
				return Response::make( $e->getMessage(), 400 );
			}

			// Place the data that needs saved in the tcustomer table into a new array
			$tcustomer = array(
				'CustomerFirstNameChange'	=> $fields['tcusquestions_first'],
				'CustomerLastNameChange'	=> $fields['tcusquestions_last'],
				'CustomerEmail'				=> $fields['tcusquestions_email'],
				'CustomerPhone'				=> $fields['tcusquestions_phone'],
				'CustomerYearMakeModel'		=> $fields['tcusquestions_vehicle'],
				'Scanned'					=> 'F'
				);

			$_tcustomer = Model::factory('Customer');
			$current = $_tcustomer->where('jobs_no', $job)
				->where('CustomerKey', $key)
				->find_one();

			if ($current) {
				$active = $current;
			} else {
				$new = $_tcustomer->create();
				$new->jobs_no = $job;
				$new->CustomerKey = $key;
				$active = $new;
			}

			// var_dump( $active );

			foreach ($tcustomer as $key => $value) {
				$active->$key = $value;
			}

			// var_dump( $active->as_array() );

			try {
				$active->save();
			} catch (Exception $e) {
				return Response::make( $e->getMessage(), 400 );
			}

			// try {
			// 	$updatedCustomer = Model::factory('Customer')->allData($key)->find_one();
			// } catch (Exception $e) {
			// 	return Response::make( $e->getMessage(), 400 );
			// }

			// var_dump( $updatedCustomer->as_array() );

			return Response::make( json_encode( $customer->as_array() ), 200 );
		} else {
			return Response::make( 'No Data to Save', 400 );
		}
	}

}