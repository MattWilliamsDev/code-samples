<?php

class Client
{

	/**
	 * Find all client data
	 * @param  [string/int] $jobs_no
	 * @return [array]      JSON encoded array of client data for use in client-side apps
	 */
	public static function find($jobs_no) {
		// TODO: These fields can vary by template type!
		// This seems to be the case particularly with images.
		$taxMatchJobs = array(
			// Specific job #'s were here (Being instructed to hard-code things makes me cringe...)
			);

		$job = Model::factory('Job')->find_one($jobs_no);

		if ($job) {
			$values = $job->getMVSValues();

			if (in_array($jobs_no, $taxMatchJobs)) {
				$values['slot_game_theme'] = 'taxmatch';
			} else {
				$values['slot_game_theme'] = 'fatwin';
			}

			$client = new self();

			$client->name        = $values[MVSField::COMPANY_NAME];
			$client->phone       = $values[MVSField::PHONE];
			
			$client->address = array(
				'address' => $values[MVSField::ADDRESS],
				'city' => $values[MVSField::CITY],
				'state' => $values[MVSField::STATE],
				'zip' => $values[MVSField::ZIP],
			);

			$client->contactName = $values[MVSField::CONTACT_NAME];
			$client->job         = $jobs_no;

			$client->logo        = $client->_buildArtfileUrl($values[MVSField::LOGO]);

			$client->background  = $client->_buildArtfileUrl($values[MVSField::BACKGROUND]);

			$client->hasKiosk = Jobsdata::get_bool($jobs_no,1,25,1923);

			$client->socialaccounts = array(
				'fb' => array(
					'url' => $values[MVSField::FACEBOOK_LINK],
					'enabled' => !empty($values[MVSField::FACEBOOK_LINK])
				),
				'twitter' => array(
					'url' => $values[MVSField::TWITTER_LINK],
					'enabled' => !empty($values[MVSField::TWITTER_LINK])
				),
				'gplus' => array(
					'url' => $values[MVSField::GOOGLE_LINK],
					'enabled' => !empty($values[MVSField::GOOGLE_LINK])
				)
			);

			$client->website = $values[MVSField::WEBSITE];

			$client->notificationOptIn = !!$values[MVSField::NOTIFICATION_OPT_IN];
			$client->nada = array(
				'off' 			=> (boolean) $values[MVSField::NADA_OFF],
				'aggressive' 	=> (boolean) $values[MVSField::NADA_AGGRESSIVE],
				'showBonus'		=> (boolean) $values[MVSField::SHOW_TRADE_BONUS]
			);

			$client->questions = array_filter(array(
				$client->_parseQuestion($values[MVSField::QUESTION_1], MVSField::QUESTION_1),
				$client->_parseQuestion($values[MVSField::QUESTION_2], MVSField::QUESTION_2),
				$client->_parseQuestion($values[MVSField::QUESTION_3], MVSField::QUESTION_3),
				$client->_parseQuestion($values[MVSField::QUESTION_4], MVSField::QUESTION_4),
			));

			$client->offer = array(
				'headline' => $values[MVSField::OFFER_HEADLINE],
				'description' => $values[MVSField::OFFER_DESCRIPTION],
				'legal' => $values[MVSField::OFFER_LEGAL_DISCLAIMER],
				'user' 		=> array(),
				'dealer'	=> array(),
				'expires' 	=> date('YMD', strtotime('+6weeks'))
			);

			$client->prizes = array(
				'defaultPrize' => array(
					'name' => $values[MVSField::DEFAULT_PRIZE],
					'slot' => (int) $values[MVSField::DEFAULT_PRIZE_SLOT],
					'image' => $client->_buildArtfileUrl(MVSValue::get_value(MVSField::DEFAULT_PRIZE_IMAGE, $jobs_no, null, 2))
				),
				'list' => array(
					array(
						'name' => MVSValue::get_value(MVSField::GRAND_PRIZE_1, $jobs_no, null, 1),
						'image' => $client->_buildArtfileUrl(MVSValue::get_value(MVSField::GRAND_PRIZE_1, $jobs_no, null, 2)),
						'slot' => (int) $values[MVSField::GRAND_PRIZE_1_SLOT],
						'value' => $values[MVSField::GRAND_PRIZE_1_VALUE],
					),
					array(
						'name' => MVSValue::get_value(MVSField::GRAND_PRIZE_2, $jobs_no, null, 1),
						'image' => $client->_buildArtfileUrl(MVSValue::get_value(MVSField::GRAND_PRIZE_2, $jobs_no, null, 2)),
						'slot' => (int) $values[MVSField::GRAND_PRIZE_2_SLOT],
						'value' => $values[MVSField::GRAND_PRIZE_2_VALUE],
					),
					array(
						'name' => MVSValue::get_value(MVSField::GRAND_PRIZE_3, $jobs_no, null, 1),
						'image' => $client->_buildArtfileUrl(MVSValue::get_value(MVSField::GRAND_PRIZE_3, $jobs_no, null, 2)),
						'slot' => (int) $values[MVSField::GRAND_PRIZE_3_SLOT],
						'value' => $values[MVSField::GRAND_PRIZE_3_VALUE],
					),
					array(
						'name' => MVSValue::get_value(MVSField::GRAND_PRIZE_4, $jobs_no, null, 1),
						'image' => $client->_buildArtfileUrl(MVSValue::get_value(MVSField::GRAND_PRIZE_4, $jobs_no, null, 2)),
						'slot' => (int) $values[MVSField::GRAND_PRIZE_4_SLOT],
						'value' => $values[MVSField::GRAND_PRIZE_4_VALUE],
					),
					array(
						'name' => MVSValue::get_value(MVSField::GRAND_PRIZE_5, $jobs_no, null, 1),
						'image' => $client->_buildArtfileUrl(MVSValue::get_value(MVSField::GRAND_PRIZE_5, $jobs_no, null, 2)),
						'slot' => (int) $values[MVSField::GRAND_PRIZE_5_SLOT],
						'value' => $values[MVSField::GRAND_PRIZE_5_VALUE],
					),
					array(
						'name' => MVSValue::get_value(MVSField::GRAND_PRIZE_6, $jobs_no, null, 1),
						'image' => $client->_buildArtfileUrl(MVSValue::get_value(MVSField::GRAND_PRIZE_6, $jobs_no, null, 2)),
						'slot' => (int) $values[MVSField::GRAND_PRIZE_6_SLOT],
						'value' => $values[MVSField::GRAND_PRIZE_6_VALUE],
					),
					array(
						'name' => MVSValue::get_value(MVSField::GRAND_PRIZE_7, $jobs_no, null, 1),
						'image' => $client->_buildArtfileUrl(MVSValue::get_value(MVSField::GRAND_PRIZE_7, $jobs_no, null, 2)),
						'slot' => (int) $values[MVSField::GRAND_PRIZE_7_SLOT],
						'value' => $values[MVSField::GRAND_PRIZE_7_VALUE],
					),
					array(
						'name'  => $values[MVSField::INSTANT_WIN_1],
						'image' => $client->_buildArtfileUrl($values[MVSField::INSTANT_WIN_1_IMAGE]),
						'slot' => (int) $values[MVSField::INSTANT_WIN_1_SLOT],
					),
					array(
						'name'  => $values[MVSField::INSTANT_WIN_2],
						'image' => $client->_buildArtfileUrl($values[MVSField::INSTANT_WIN_2_IMAGE]),
						'slot' => (int) $values[MVSField::INSTANT_WIN_2_SLOT],
					),
					array(
						'name'  => $values[MVSField::INSTANT_WIN_3],
						'image' => $client->_buildArtfileUrl($values[MVSField::INSTANT_WIN_3_IMAGE]),
						'slot' => (int) $values[MVSField::INSTANT_WIN_3_SLOT],
					),
					array(
						'name'  => $values[MVSField::INSTANT_WIN_4],
						'image' => $client->_buildArtfileUrl($values[MVSField::INSTANT_WIN_4_IMAGE]),
						'slot' => (int) $values[MVSField::INSTANT_WIN_4_SLOT],
					),
				),
				'collageimage' => $client->_buildArtfileUrl($values[MVSField::PRIZE_COLLAGE_IMG]),
			);

			// Remove any unset prizes
			foreach ($client->prizes['list'] as $key => $val) {
				if (empty($val['name'])) {
					unset($client->prizes['list'][$key]);
				}
			}
			$client->prizes['list'] = array_values($client->prizes['list']);

			$client->livedates = array (
				'start' => $values[MVSField::SITE_START],
				'stop' => $values[MVSField::SITE_STOP]
			);

			$client->getstartedimg = $client->_buildArtfileUrl($values[MVSField::GETTING_STARTED_IMG]);

            $client->getstartedheadine      = $values[MVSField::GETTING_STARTED_HEADLINE];
            $client->getstartedsubheadline  = $values[MVSField::GETTING_STARTED_SUB_HEADLINE];
            
            $client->getstartedstep1img = $client->_buildArtfileUrl($values[MVSField::INSTRUCTIONS_STEP_1_IMG]);
            $client->getstartedstep2img = $client->_buildArtfileUrl($values[MVSField::INSTRUCTIONS_STEP_2_IMG]);
            $client->getstartedstep3img = $client->_buildArtfileUrl($values[MVSField::INSTRUCTIONS_STEP_3_IMG]);

            $client->sharepanel = array(
            	'heading'	=> $values[MVSField::SHARE_PANEL_HEADLINE],
            	'subhead'	=> $values[MVSField::SHARE_PANEL_SUB_HEADLINE]
            	);

			$client->slotgame = array (
				'theme'			=> $values['slot_game_theme'],
				'logo' 			=> $client->_buildArtfileUrl($values[MVSField::SLOT_GAME_LOGO]),
				'primaryhex' 	=> $values[MVSField::SLOT_GAME_PRIMARY_COLOR],
				'secondaryhex' 	=> $values[MVSField::SLOT_GAME_SECONDARY_COLOR]
			);

			$client->socialshares = array (
				'title'	=> str_replace('<<company name>>', $client->name, $values[MVSField::SHARE_TITLE]),
				'desc'	=> str_replace('<<company name>>', $client->name, $values[MVSField::SHARE_DESC]),
				'image'	=> $client->_buildArtfileUrl($values[MVSField::SHARE_IMAGE]),
				'text'	=> str_replace('<<company name>>', $client->name, $values[MVSField::SHARE_TEXT]),
				'tweet'	=> str_replace('<<company name>>', $client->name, $values[MVSField::SHARE_TWEET])
			);

			$client->officialrules = $values[MVSField::OFFICIAL_RULES];
			$client->apptincentive = $values[MVSField::APPT_INCENTIVE];

			/* FIELDS SPECIFIC TO FWMAIL */
			$client->recentwinners = $client->setRecentWinners($job,6);
			$client->style = $client->setStyle($values[MVSField::THEME]);
			$client->verifycode = $values[MVSField::MAIL_PRIZECODE];
			$client->displayprize = $values[MVSField::MAIL_DISPLAYPRIZE];
			if($values[MVSField::MAIL_DISPLAYPRIZE])
				$client->displayprize = true;
			else
				$client->displayprize = false;
			/* END FIELDS */

			$client->environment = FW_ENVIRONMENT;

			return $client;
		}

		return false;
	}

	private function _parseQuestion($question, $fieldId = null) {
		if (empty($question)) {
			return false;
		} elseif ($question == '*appointment*') {
			return array(
				'qId'	=> $fieldId,
				'type' 	=> 'appointment', 
				'label' => 'Would you like to setup an appointment to speak with us?'
			);
		} elseif ($question == '*nadavalue*') {
			return array(
				'qId'	=> $fieldId,
				'type' 	=> 'nada', 
				'label' => 'What type of vehicle are you currently driving?'
			);
		} else {
			$parts = explode(';', $question);
			$label = array_shift($parts);
			
			$options = array();
			foreach ($parts as $p) {
				$options[] = array('label' => $p, 'value' => $p);
			}

			return array(
				'qId'		=> $fieldId,
				'type' 		=> 'dropdown',
				'label' 	=> $label,
				'fields' 	=> array(
					'options' => $options
					)
				);
		}
	}

	private function _buildArtfileUrl($value) {
		if (!empty($value)) {
			return 'http://e3.perq.com/artfiles/' . $value;
		}

		return null;
	}

	public static function setRecentWinners($job, $noofwinners = null) {
		$winners = ORM::for_table('tprizedistro')->raw_query("SELECT * 
				FROM tprizedistro 
				INNER JOIN JOBS on tprizedistro.jobs_no=JOBS.jobs_no
				INNER JOIN tcustomer ON tprizedistro.jobs_no=tcustomer.jobs_no AND tcustomer.CustomerKey=tprizedistro.CustomerKey
				LEFT JOIN fbuser ON tprizedistro.jobs_no=fbuser.jobs_no AND tprizedistro.CustomerKey=fbuser.CustomerKey
				WHERE tprizedistro_awarded='T'
				AND jobs_clients_no=:client
				ORDER BY tprizedistro_type DESC, tprizedistro_ts DESC
				LIMIT 6", array('client' => $job->jobs_clients_no))->find_many();
		$i = 0;
		foreach ($winners AS $winner) {
			$winner['CustomerFirstNameChange'] ? $winnerObj[$i]->first = strtolower($winner['CustomerFirstNameChange']) : strtolower($winnerObj[$i]->first = $winner['CustomerFirstName']);
			$winner['CustomerLastNameChange'] ? $winnerObj[$i]->last = strtolower($winner['CustomerLastNameChange']) : strtolower($winnerObj[$i]->last = $winner['CustomerLastName']);
			$winner['CustomerCityChange'] ? $winnerObj[$i]->city = strtolower($winner['CustomerCityChange']) : strtolower($winnerObj[$i]->city = $winner['CustomerCity']);
			$winner['CustomerStateChange'] ? $winnerObj[$i]->state = $winner['CustomerStateChange'] : $winnerObj[$i]->state = $winner['CustomerState'];
			$winner['fbuser_profilepic'] ? $winnerObj[$i]->pic = $winner['fbuser_profilepic'] : $winnerObj[$i]->pic = "";
			$winnerObj[$i]->prize = $winner['tprizedistro_desc'];
			$i++;
		}

		while($i <= 5) {
			$winnerObj[$i]->first = $winnerObj[$i]->last = $winnerObj[$i]->city = $winnerObj[$i]->state = $winnerObj[$i]->prize = $winnerObj[$i]->pic = "";
			$i++;
		}
		return $winnerObj;

	}

	public static function setStyle($theme) {
		$styleKey = array(6060=>1);
		$hexKey = array(1=>'#eea53f');

		$style['purlStyle'] = $styleKey[$theme];
		$style['imgDir'] = "img" . $style['purlStyle'];	
		$style['hex'] = $hexKey[$style['purlStyle']];	

		return $style;
	}

}