<?php

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Kreait\Firebase\Factory;
use Slim\Factory\AppFactory;

global $customErrorHandler, $addHeadersMiddleware;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Firebase initialization
$firebase = (new Factory)
    ->withServiceAccount(__DIR__ . '/../firebase_sa.json')
    ->createAuth();

$app = AppFactory::create();

require __DIR__ . '/../src/database.php';
require __DIR__ . '/../src/dependencies.php';
require __DIR__ . '/../src/middleware.php';

// Routes
require __DIR__ . '/../src/routes.php';

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware($_ENV["PROFILE"] == "development", true, true);
$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

$app->add($addHeadersMiddleware);


$app->run();
