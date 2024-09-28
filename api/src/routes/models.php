<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Response as SlimResponse;

global $app, $tokenMiddleware, $pdo;

function validateRequest($data): SlimResponse|null
{
    // Check if name is provided in the payload
    if (!isset($data['name']) || !isset($data['miniatures'])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Name and Miniatures fields are required']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }

    // Validate that 'miniatures' is an array
    if (!is_array($data['miniatures'])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Miniatures must be an array']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }

    // Validate each miniature in the array has 'stage' and 'amount'
    foreach ($data['miniatures'] as $index => $miniature) {
        if (!isset($miniature['stage']) || !isset($miniature['amount'])) {
            $response = new SlimResponse();
            $response->getBody()->write(json_encode([
                'message' => "Each miniature must have 'stage' and 'amount' fields",
                'error_at_index' => $index
            ], JSON_UNESCAPED_UNICODE));
            return $response->withStatus(400);
        }

        // You can also add more detailed validation here, e.g., checking if 'amount' is a number
        if (!is_numeric($miniature['stage']) || !is_numeric($miniature['amount'])) {
            $response = new SlimResponse();
            $response->getBody()->write(json_encode([
                'message' => "'amount' and 'stage' must be a numeric values",
                'error_at_index' => $index
            ], JSON_UNESCAPED_UNICODE));
            return $response->withStatus(400);
        }
    }

    return null;
}

$app->post("/groups/{groupId}/models", function (Request $request, Response $response, array $args) use ($pdo) {
    $body = $request->getBody();
    $data = json_decode($body, true);

    $error = validateRequest($data);
    if (!is_null($error)) {
        return $error;
    }

    $userId = $request->getAttribute('firebaseUser');
    $groupId = $args['groupId'];
    $modelId = Uuid::uuid4()->toString();
    $name = $data['name'];

    $pdo->beginTransaction();

    // Insert the model in the database
    $sql = "
        INSERT INTO models (user_id, group_id, model_id, name)
        VALUES (:user_id, :group_id, :model_id, :name);
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':group_id', $groupId);
    $stmt->bindParam(':model_id', $modelId);
    $stmt->bindParam(':name', $name);
    $stmt->execute();

    // Generate an insert sql command for the miniatures;
    $sqlMiniatures = "INSERT INTO miniatures (user_id, model_id, stage_index, amount) VALUES ";
    $placeholders = [];
    $values = [];
    foreach ($data['miniatures'] as $index => $miniature) {
        $placeholders[] = "(:user_id{$index}, :model_id{$index}, :stage_index{$index}, :amount{$index})";

        // Bind values, using the new model ID
        $values["user_id{$index}"] = $userId;
        $values["model_id{$index}"] = $modelId;
        $values["stage_index{$index}"] = $miniature['stage'];
        $values["amount{$index}"] = $miniature['amount'];
    }
    // Complete the SQL query
    $sqlMiniatures .= implode(", ", $placeholders);

    // Prepare and execute the miniatures insertion query
    $stmtMiniatures = $pdo->prepare($sqlMiniatures);
    $stmtMiniatures->execute($values);

    if ($pdo->commit()) {
        // Return the created model
        $response->getBody()->write(json_encode([
            'id' => $modelId,
            'name' => $name,
            'miniatures' => $data['miniatures']
        ], JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    } else {
        $pdo->rollBack();
        $response->getBody()->write(json_encode(['error' => 'Failed to create group'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);

$app->put("/models/{modelId}", function (Request $request, Response $response, array $args) use ($pdo) {
    $body = $request->getBody();
    $data = json_decode($body, true);

    $error = validateRequest($data);
    if (!is_null($error)) {
        return $error;
    }

    $userId = $request->getAttribute('firebaseUser');
    $modelId = $args['modelId'];
    $name = $data['name'];

    $pdo->beginTransaction();

    $sql = "
        UPDATE models m
        SET name = :name
        WHERE 
           m.user_id = :user_id AND m.model_id = :model_id;
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':model_id', $modelId);
    $stmt->bindParam(':name', $name);
    $stmt->execute();

    foreach ($data['miniatures'] as $miniature) {
        $sqlMiniatures = "
            INSERT INTO miniatures (user_id, model_id, stage_index, amount)
            VALUES (:user_id, :model_id, :stage_index, :amount)
            ON DUPLICATE KEY UPDATE amount = :amount_update;
        ";
        $stmtMiniatures = $pdo->prepare($sqlMiniatures);
        $stmtMiniatures->bindParam(':user_id', $userId);
        $stmtMiniatures->bindParam(':model_id', $modelId);
        $stmtMiniatures->bindParam(':stage_index', $miniature['stage']);
        $stmtMiniatures->bindParam(':amount', $miniature['amount']);
        $stmtMiniatures->bindParam(':amount_update', $miniature['amount']);
        $stmtMiniatures->execute();
    }

    if ($pdo->commit()) {
        // Return the created model
        $response->getBody()->write(json_encode([
            'id' => $modelId,
            'name' => $name,
            'miniatures' => $data['miniatures']
        ], JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } else {
        $pdo->rollBack();
        $response->getBody()->write(json_encode(['error' => 'Failed to create group'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);

$app->delete("/models/{modelId}", function (Request $request, Response $response, array $args) use ($pdo) {
    $userId = $request->getAttribute('firebaseUser');
    $modelId = $args['modelId'];

    $sql = "
        DELETE FROM models
        WHERE 
            models.user_id = :user_id AND models.model_id = :model_id;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':model_id', $modelId);

    if ($stmt->execute()) {
        return $response->withHeader('Content-Type', 'application/json')->withStatus(204);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to delete model'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);