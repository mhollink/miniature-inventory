<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Psr7\Response as SlimResponse;

global $app, $tokenMiddleware, $pdo;

$app->patch("/collections", function (Request $request, Response $response) use ($pdo) {

    $body = $request->getBody();
    $data = json_decode($body, true);

    // Check if name is provided in the payload
    if (!isset($data['groups']) || !is_array($data["groups"])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Groups field is required and must be an array']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }

    // Validate each group in the array has 'stage' and 'amount'
    foreach ($data['groups'] as $index => $group) {
        if (!isset($group['groupId']) || !isset($group['collectionId']) || !isset($group["index"])) {
            $response = new SlimResponse();
            $response->getBody()->write(json_encode([
                'message' => "Each group must have an 'groupId', 'collectionId' and 'index' field",
                'error_at_index' => $index
            ], JSON_UNESCAPED_UNICODE));
            return $response->withStatus(400);
        }

        // You can also add more detailed validation here, e.g., checking if 'amount' is a number
        if (!is_numeric($group['index'])) {
            $response = new SlimResponse();
            $response->getBody()->write(json_encode([
                'message' => "'index' must be a numeric value",
                'error_at_index' => $index
            ], JSON_UNESCAPED_UNICODE));
            return $response->withStatus(400);
        }
    }

    $userId = $request->getAttribute('firebaseUser');
    $pdo->beginTransaction();
    foreach ($data['groups'] as $group) {
        $groupId = $group['groupId'];
        $collectionId = $group['collectionId'];
        $index = $group['index'];
        $sql = "
            UPDATE groups 
            SET collection_id = :collection_id, sort_index = :sort_index 
            WHERE group_id = :group_id and user_id = :user_id;
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':collection_id', $collectionId);
        $stmt->bindParam(':sort_index', $index);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':group_id', $groupId);
        $stmt->execute();
    }

    if ($pdo->commit()) {
        return $response->withStatus(204);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to update ordering'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);

$app->patch("/groups/{groupId}", function (Request $request, Response $response, array $args) use ($pdo) {

    $body = $request->getBody();
    $data = json_decode($body, true);

    // Check if name is provided in the payload
    if (!isset($data['models']) || !is_array($data["models"])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Models field is required and must be an array']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }

    // Validate each model in the array has 'stage' and 'amount'
    foreach ($data['models'] as $index => $model) {
        if (!isset($model['id']) || !isset($model["index"])) {
            $response = new SlimResponse();
            $response->getBody()->write(json_encode([
                'message' => "Each model must have an 'id' and 'index' field",
                'error_at_index' => $index
            ], JSON_UNESCAPED_UNICODE));
            return $response->withStatus(400);
        }

        // You can also add more detailed validation here, e.g., checking if 'amount' is a number
        if (!is_numeric($model['index'])) {
            $response = new SlimResponse();
            $response->getBody()->write(json_encode([
                'message' => "'index' must be a numeric value",
                'error_at_index' => $index
            ], JSON_UNESCAPED_UNICODE));
            return $response->withStatus(400);
        }
    }

    $userId = $request->getAttribute('firebaseUser');
    $groupId = $args['groupId'];

    $pdo->beginTransaction();
    foreach ($data['models'] as $model) {
        $id = $model['id'];
        $index = $model['index'];
        $sql = "
            UPDATE models 
            SET sort_index = :sort_index 
            WHERE model_id = :model_id AND group_id = :group_id AND user_id = :user_id;
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':sort_index', $index);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':group_id', $groupId);
        $stmt->bindParam(':model_id', $id);
        $stmt->execute();
    }

    if ($pdo->commit()) {
        return $response->withStatus(204);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to update ordering'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);
