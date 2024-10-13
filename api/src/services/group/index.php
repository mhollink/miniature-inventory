<?php

namespace App\services\group;

global $pdo, $supportValidations;

require __DIR__ . '/GroupRepository.php';
require __DIR__ . '/GroupValidations.php';
require __DIR__ . '/GroupMapper.php';
require __DIR__ . '/GroupService.php';

$groupMapper = new GroupMapper();
$groupRepository = new GroupRepository($pdo);
$groupValidations = new GroupValidations();
$groupService = new GroupService($groupRepository, $groupMapper, $groupValidations, $supportValidations);