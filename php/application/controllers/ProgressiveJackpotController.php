<?php

class ProgressiveJackpotController extends BaseController
{

	public function actionCurrent()
    {
		return ProgressiveJackpot::currentValue();
	}

    public function actionWinners()
    {
        $winners = ProgressiveJackpot::getWinners();
        return Response::make( json_encode($winners), 200 );
    }
	
}