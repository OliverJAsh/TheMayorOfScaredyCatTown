<?php

class Controller {
	private $load,
			$model,
			$query,
			$page;
	
	public function __construct($page, $query) {
		$this->load = new Load();
		$this->model = new Model();
		$this->page = $page;
		$this->query = $query;

		// determine what page you're on
		switch ($this->page)
		{
			case 'post':
				$this->post();
			break;
			case 'get-logs':
				$this->getLogs();
			break;
			case 'get-log':
				$this->getLog();
			break;
			default:
				$this->home();
			break;
		}
	}
	
	private function home() {
		$this->load->view();
	}
	
	private function post() {
		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			echo json_encode($this->model->saveUser($_POST));
		}
	}

	private function getLogs() {
		if ($_SERVER['REQUEST_METHOD'] === 'GET') {
			echo json_encode($this->model->getLogs());
		}
	}

	private function getLog() {
		if ($_SERVER['REQUEST_METHOD'] === 'GET') {
			$fbid = (isset($this->query['fbid'])) ? $this->query['fbid'] : null;

			if (is_null($fbid) || !is_numeric($fbid)) {
				echo json_encode(array('status' => 'ERROR'));
			} else {
				echo json_encode($this->model->getLog($fbid));
			}
		}
	}
}