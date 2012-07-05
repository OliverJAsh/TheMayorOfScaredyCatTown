<?php

class Model {
	private $mongoDB,
		    $database,
		    $users;
	
	public function __construct() {
		$this->mongoDB = new Mongo();
		$this->database = $this->mongoDB->selectDB('tmosct');
		$this->users = $this->database->createCollection('users');
	}
	
	public function saveUser($user) {
		$lastVisit = false;
		
		if ($find = $this->users->findOne(array('fbid' => $user['fbid']))) {
			$find['visit_count'] = $find['visit_count'] + 1;
			$find['signature'] = $user['signature'];
			$this->users->save($find);
			$lastVisit = $find['last_visit'];
			$count = $find['visit_count'];
		} else {
			$user['initials'] = null;
			$names = explode(" ", $user['name']);
			foreach ($names as $name) {
				$user['initials'] .= strtoupper(substr($name, 0, 1));
			}

			$user['visit_count'] = 1;
			$lastVisit = $user['last_visit'] = new MongoDate();
			$this->users->insert($user);
			$count = $user['visit_count'];	
		}
		
		return array('visit_count' => $count, 'last_visit' => date('m/d/y', $lastVisit->sec));
	}

	public function getLogs() {
		$find = $this->users->find()->sort(array('last_visit' => -1));
		$logs = array();

		foreach ($find as $log) {
			$logs[] = $log;
		}

		return $logs;
	}

	public function getLog($fbid) {
		if ($find = $this->users->findOne(array('fbid' => $fbid))) {
			$find['last_visit'] = date('m/d/y', $find['last_visit']->sec);

			return $find;
		} else {
			return array('status' => 'ERROR');
		}
	}
}