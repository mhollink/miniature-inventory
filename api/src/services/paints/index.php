<?php

namespace App\services\paints;

global $pdo;

require __DIR__ . '/PaintAlreadyInStorageException.php';
require __DIR__ . '/PaintRepository.php';
require __DIR__ . '/PaintValidations.php';
require __DIR__ . '/PaintService.php';

$paintRepository = new PaintRepository($pdo);
$paintValidations = new PaintValidations();
$paintService = new PaintService($paintValidations, $paintRepository);