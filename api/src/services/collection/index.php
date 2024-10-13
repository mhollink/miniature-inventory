<?php

namespace App\services\collection;

global $pdo, $supportValidations;

use Ramsey\Uuid\Uuid;

require __DIR__ . '/CollectionValidations.php';
require __DIR__ . '/CollectionRepository.php';
require __DIR__ . '/CollectionMapper.php';
require __DIR__ . '/CollectionService.php';

$collectionMapper = new CollectionMapper();
$collectionRepository = new CollectionRepository($pdo, Uuid::getFactory());
$collectionValidations = new CollectionValidations();
$collectionService = new CollectionService($collectionRepository, $collectionMapper, $collectionValidations, $supportValidations);