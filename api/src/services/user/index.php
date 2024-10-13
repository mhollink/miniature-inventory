<?php

namespace App\services\user;

global $pdo;

require __DIR__ . "/SupportValidations.php";

$supportValidations = new SupportValidations($pdo);