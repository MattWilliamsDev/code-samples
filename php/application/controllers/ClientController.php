<?php

class ClientController extends BaseController
{

	public function actionJob($jobs_no)
    {
		return json_encode(Client::find($jobs_no));
	}

    public function actionHours( $jobs_no )
    {
        require_once FW_APP_ROOT . '/lib/functions.php'; // To utilize legacy functions (in case you're not into the whole brevity thing - the Dude)

        $params = $this->request->post;

        if ( isset( $params->request->get['args'] )) {
            $url = $this->request->get['args'];
        }

        if ( isset( $params['day'] )) {
            $day = $params['day'];
        } else {
            return false;
        }

        $times = getBusinessHours( $jobs_no, $day );

        return json_encode( $times );
    }
    
}