<?php

class WebsiteController extends BaseController
{
    
	public function actionIndex() {
		return file_get_contents(dirname(__FILE__) . '/../../main.html');
	}
	
}