<?php


class InstantWin_DefaultController extends BaseController {

	public function actionIndex($jobs_no, $subjobs_no, $uri, $isGurl, $share)
    {
		// TODO: Bring in a templating engine
		// TODO: Provide front-end with data necessary to render job

        try {
            $client = Client::find( $jobs_no );
        } catch (Exception $e) {
            return Response::make( $e->getMessage(), 400 );
        }
        
        $this->setViewVar('client_name', $client->name);
        $this->setViewVar('jobs_no', $jobs_no);
        $this->setViewVar('subjobs_no', $subjobs_no);
        $this->setViewVar('is_gurl', $isGurl);
        $this->setViewVar('share', $share);

        if ( $isGurl === true && $uri != '' )
            $this->setViewVar('gurl', $uri);
        else
            $this->setViewVar('gurl', false);
		
        return $this->render('../modules/InstantWin/views/index');
	}
	
}