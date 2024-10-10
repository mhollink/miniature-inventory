<?php

global $app, $tokenMiddleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Example unprotected route
$app->get('/health', function (Request $request, Response $response) {
    $payload = ['status' => "up"];
    $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
    return $response;
});

include "routes/user.php";
include "routes/collections.php";
include "routes/groups.php";
include "routes/models.php";
include "routes/sorting.php";
include "routes/paints.php";
include "routes/statistics.php";