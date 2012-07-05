<?php

class Load {
	public function view($data = array()) {
		if (is_array($data)) {
			extract($data);
		}
		
		include 'views/layout.html.php';
	}
}