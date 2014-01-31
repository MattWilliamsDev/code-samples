<?php

class InstantWin_CustomerController extends BaseController {

	// /module/InstantWin/Customer/allowed?email=mdouglas@cik.com 
	public function actionAllowed() {
		$email = $this->request->get['email'];
		$jobs_no = $this->request->get['jobs_no'];

		$customer = Model::factory('CustomerQuestions')
			->job($jobs_no)
			->email($email)
			->where_gte('tcusquestions_ts', mktime(0,0,0))
			->find_one();
		
		return json_encode(!$customer);
	}

	public function actionLogin() {
		$email = $this->request->get['login_email'];
		$jobs_no = $this->request->get['jobs_no'];

		// Verify that the customer is allowed (has not played yet today)
		$allowed = $this->request(Request::make(
			'/module/InstantWin/Customer/allowed', 
			'GET', 
			array('email' => $email, 'jobs_no' => $jobs_no)
		));

		$customer = Model::factory('CustomerQuestions')
			->job($jobs_no)
			->email($email)
			->find_one();

		if ($customer) {
			return array(
				'allowed' => $allowed->getContent() === 'true',
				'valid' => true, 
				'customerKey' => $customer->CustomerKey
			);
		}

		return array('valid' => false);
	}
}