<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

global $app, $tokenMiddleware, $pdo;

$app->get('/statistics', function (Request $request, Response $response) use ($pdo) {
    $sql = "
        SELECT 
	        (SELECT COUNT(DISTINCT user_id) FROM collections) AS total_users,
            (SELECT COUNT(*) FROM collections) AS total_collections,
            (SELECT COUNT(*) FROM groups) AS total_groups,
            (SELECT COUNT(*) FROM models) AS total_models,
    		CAST(IFNULL((SELECT SUM(amount) FROM miniatures), 0) AS SIGNED) AS total_miniatures;
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $response->getBody()->write(json_encode($result, JSON_UNESCAPED_UNICODE));
    return $response;
});

$app->get('/health', function (Request $request, Response $response) {

    $response->getBody()->write(json_encode(['status' => "up"], JSON_UNESCAPED_UNICODE));
    return $response;
});