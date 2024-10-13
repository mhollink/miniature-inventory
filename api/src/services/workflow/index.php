<?php

namespace App\services\workflow;

global $pdo;

require __DIR__ . "/WorkflowRepository.php";
require __DIR__ . "/WorkflowService.php";

$workflowRepository = new WorkflowRepository($pdo);
$workflowService = new WorkflowService($workflowRepository);