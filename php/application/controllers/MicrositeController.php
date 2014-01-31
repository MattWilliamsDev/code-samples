<?php

class MicrositeController extends BaseController
{

	public function actionIndex( $uri = null, $job = null )
	{
		$isGurl = false;
		$isPurl = false;
		$domain = $this->request->server['HTTP_HOST'];

		if (!empty($this->request->get['CK'])) {
			
			// Support legacy social links, e.g. /index.php?CK=83223025487
			if (!$job)
				$jobs_no = (int) substr($this->request->get['CK'], 0, 5);
			else
				$jobs_no = (int) $job;
		
		} elseif (!$job && preg_match('/^(.*\.)?(\d{0,6})\..*$/', $domain, $match)) {
			
			$jobs_no = $match[2];
		
		} else {

			if (!$job):
				
				/**
				 * Job Lookup by GURL
				 * @var [type]
				 */
				if ($job_data = Job::find_by_gurl($uri)) {
					$isGurl = true;
					$_SESSION['gurl'] = $uri;
					$jobs_no = (int) $job_data->jobs_no;
					$subjobs_no = (int) $job_data->subjobs_no;
				
				} else {
					return Response::make($this->render('error'), 404);
				}

			else:
				
				/**
				 * This thing has a PURL
				 */
				$isGurl = false;
				$isPurl = true;
				$_SESSION['purl'] = $uri;
				$jobs_no = (int) $job;

			endif;

		}

		$hasKiosk = Jobsdata::get_bool($jobs_no,1,25,1923);
		$template = MVSValue::get_value(MVSField::TEMPLATE_NO, $jobs_no);

		// New social share format: http://www.86910.fatwin.com/share?src=fb&ref=86910000001
		if ($this->request->getRequestUri() == 'share' && !empty($this->request->get['src'])) {

			$share = array(
				'network' => $this->request->get['src'],
				'ref' => !empty($this->request->get['ref']) ? $this->request->get['ref'] : null
			);

			if (!empty($this->request->get['sub'])) {
				$subjobs_no = (int) $this->request->get['sub'];
			} else {
				$subjobs_no = 1;
			}

		} else {
			$share = false;
		}

		if ($template == MVTemplate::INSTANT_WIN || 
			$template == MVTemplate::BIZPROPS_3IS) {

			// Include legacy functions.
			require_once FW_APP_ROOT . '/lib/functions.php';

			// Delegate to InstantWin\DefaultController::index()
			return $this->delegate('#InstantWin', array($jobs_no, $subjobs_no, $uri, $isGurl, $share));

		} elseif ($template == MVTemplate::FATWIN_EVENTS) {

			// Delegate to Events\DefaultController::index()
			return $this->delegate('#Events');

		} elseif ($template == MVTemplate::FATWIN_MAIL) {
			// Include legacy style creation.
			require_once FW_APP_ROOT . '/lib/style.inc.php';
			
			// Delegate to Fatwin Mail\DefaultController::index()
			return $this->delegate('#Mail', array($jobs_no, $uri));
			
		}

		// Job is not a valid FATWIN job (Templates 10, 13, 15, 16)
		return Response::make($this->render('error'), 404);
	}

	public function actionSave( $userKey = null )
	{
		require_once FW_APP_ROOT . '/lib/functions.php';
		require_once FW_APP_ROOT . '/lib/cikPdo.class.php';
		// require_once FW_APP_ROOT . '/models/CustomerPrizeSelection.php';

		$panel;
		$fields;
		$key;
		$job;
		$params = $this->request->post;

		foreach ( $params as $k => $value ):
			switch ( $k ):
				case 'key':
				case 'CustomerKey':
					if ( !$userKey )
						$key = $value;
					else
						$key = $userKey;
					break;

				case 'job':
				case 'form':
				case 'panel':
				case 'pIndex':
				case 'qIndex':
				case 'type':
					// Create these variables so that we can create a separate array of actual form fields
					$$k = $value;
					break;

				default:
					$fields[$k] = $value;
					break;
			endswitch;
		endforeach;



		$saveParams = array(
			'panel'		=> $panel,
			'answers'	=> $fields,
			'key'		=> $key,
			'job'		=> $job
			);

		try {
			$result = savePanelData( $saveParams );
		} catch ( Exception $e ) {
			// return Response::make(array('message' => $e->getMessage(), 'backtrace' => debug_backtrace()), 404 );
			return Response::make( $this->render('error'), 404 );
		}

		if ( $result['update'] === true ) {
			$cust = Model::factory('Customer');
			try {
				$customer = $cust->where('CustomerKey', $key)->find_one();
			} catch (Exception $e) {
				return Response::make( $e->getMessage(), 404 );
			}

			$tcusprizesel_no = $customer->tcusprizesel_no;
			$tcusprizesel_key = $customer->CustomerKey;
			
			$tcusprizesel = Model::factory('CustomerPrizeSelection');
			$visitor = $tcusprizesel->find_one( $tcusprizesel_no );
			// $visitor = $tcusprizesel->where('tcusprizesel_no', $tcusprizesel_no)->find_one();
			
			// var_dump( $visitor->as_array() );
			$visitor->CustomerKey = $key;
			
			try {
				$visitor->save();
			} catch (Exception $e) {
				return Response::make( $e->getMessage(), 404 );
			}
		}

		$result['visitor'] = $visitor->as_array();

		if ( $result['update'] == true )
			return Response::make( $result, 201 );
		else
			return Response::make( $result['update'], 200 );
		// exit(json_encode( $result ));
	}
}
