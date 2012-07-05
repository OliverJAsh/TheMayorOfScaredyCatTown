<?php

ini_set('display_errors', E_ALL);

require '../application/load.php';
require '../application/model.php';

require '../application/controller.php';

$page = (isset($_GET['page'])) ? $_GET['page'] : null;
if (!is_null($page)) {
	unset($_GET['page']);
}

new Controller($page, $_GET);