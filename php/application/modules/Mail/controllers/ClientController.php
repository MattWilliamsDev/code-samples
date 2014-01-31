<?php

class Mail_ClientController extends BaseController
{
    public function actionVerified() {
        $code = $this->request->get['code'];
        $jobs_no = $this->request->get['jobs_no'];

        $client = Model::factory('CustomerQuestions')
            ->job($jobs_no)
            ->email($email)
            ->where_gte('tcusquestions_ts', mktime(0,0,0))
            ->find_one();
        
        return json_encode(!$customer);
    }
}