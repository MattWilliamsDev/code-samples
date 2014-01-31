<?php

class Events_DefaultController extends BaseController {

	public function actionIndex() {
		// Load legacy FW Events
		chdir(FW_APP_ROOT . '/../legacy');
		ob_start();
		require_once 'index.php';
		return ob_get_clean();
	}
}