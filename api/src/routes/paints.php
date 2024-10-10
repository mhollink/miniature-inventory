<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Response as SlimResponse;

global $app, $tokenMiddleware, $pdo;

$app->post('/paints', function (Request $request, Response $response) use ($pdo) {

    $body = $request->getBody();
    $data = json_decode($body, true);

    // Check if name is provided in the payload
    if (!isset($data['brand']) || !isset($data['range']) || !isset($data['name'])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Brand, Range, Name fields are required']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }


    $userId = $request->getAttribute('firebaseUser');
    $paintId = Uuid::uuid4()->toString();
    $brand = $data['brand'];
    $range = $data['range'];
    $name = $data['name'];
    $color = $data['color'];

    $sql = "
        INSERT INTO `paints` (`user_id`, `paint_id`, `paint_brand`, `paint_range`, `paint_name`, `paint_color_code`) 
        VALUES (:user_id, :id, :brand, :range, :name, :color)
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':id', $paintId);
    $stmt->bindParam(':brand', $brand);
    $stmt->bindParam(':range', $range);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':color', $color);

    if ($stmt->execute()) {
        // Return the created collection
        $response->getBody()->write(json_encode([
            'id' => $paintId,
            'brand' => $brand,
            'range' => $range,
            'name' => $name,
            'color' => $color,
        ], JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to create collection'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);

$app->get('/paints', function (Request $request, Response $response) use ($pdo) {
    $userId = $request->getAttribute('firebaseUser');

    $sql = "
        SELECT paint_id as id, paint_brand as brand, paint_range as `range`, paint_name as name, paint_color_code as code
        FROM `paints`
        WHERE user_id = :user_id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response->getBody()->write(json_encode($result, JSON_UNESCAPED_UNICODE));
    return $response;
})->add($tokenMiddleware);

$app->delete('/paints', function (Request $request, Response $response) use ($pdo) {
    $userId = $request->getAttribute('firebaseUser');

    $body = $request->getBody();
    $data = json_decode($body, true);

    // Check if name is provided in the payload
    if (!isset($data['ids'])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Ids field is required']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }

    // Validate that 'miniatures' is an array
    if (!is_array($data['ids'])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Ids must be an array']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }

    $ids = $data['ids'];
    $inQuery = str_repeat('?,', count($ids) - 1) . '?'; // gets ?,?,?,?,?,?

    $sql = "
        DELETE FROM `paints` WHERE user_id = ? AND `paint_id` in ($inQuery) 
    ";

    $stmt = $pdo->prepare($sql);
    $params = array_merge([$userId], $ids);

    if ($stmt->execute($params)) {
        // Return the created collection
        return $response->withHeader('Content-Type', 'application/json')->withStatus(204);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to delete all (or some of the) given paints'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);
