<?php

namespace App\services\model;

global $pdo;

require __DIR__ . '/ModelRepository.php';
require __DIR__ . '/ModelValidations.php';
require __DIR__ . '/ModelService.php';

$modelRepository = new ModelRepository($pdo);
$modelValidations = new ModelValidations();
$modelService = new ModelService($modelValidations, $modelRepository);