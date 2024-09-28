<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Response as SlimResponse;

global $app, $tokenMiddleware, $pdo;

$app->post("/collections/{collectionId}/groups", function (Request $request, Response $response, array $args) use ($pdo) {

    $body = $request->getBody();
    $data = json_decode($body, true);

    // Check if name is provided in the payload
    if (!isset($data['name'])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Name is required']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }

    $userId = $request->getAttribute('firebaseUser');
    $collectionId = $args['collectionId'];
    $groupId = Uuid::uuid4()->toString();
    $name = $data['name'];

    $support = getSupporterLevel($pdo, $userId);
    if ($support == 'none') {
        $stmtColCount = $pdo->prepare("SELECT COUNT(*) AS item_count FROM `groups` WHERE user_id = :user_id");
        $stmtColCount->bindParam(':user_id', $userId);
        $stmtColCount->execute();
        $result = $stmtColCount->fetch();
        $itemCount = $result['item_count'];
        if ($itemCount >= 20) {
            $response->getBody()->write(json_encode(['error' => 'Failed to create group, support is required to create more than 20 groups'], JSON_PRETTY_PRINT));
            return $response->withStatus(409);
        }
    }

    $sql = "
        INSERT INTO groups (user_id, collection_id, group_id, name) 
        VALUES (:user_id, :collection_id, :group_id, :name)
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':collection_id', $collectionId);
    $stmt->bindParam(':group_id', $groupId);
    $stmt->bindParam(':name', $name);

    if ($stmt->execute()) {
        // Return the created group
        $response->getBody()->write(json_encode([
            'id' => $groupId,
            'name' => $name,
        ], JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to create group'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);

$app->get('/groups', function (Request $request, Response $response) use ($pdo) {
    $userId = $request->getAttribute('firebaseUser');

    // Query to get data from the tables
    $sql = "
        SELECT 
            g.group_id AS group_id,
            g.name AS group_name,
            g.sort_index AS group_index,
            m.model_id AS model_id,
            m.name AS model_name,
            m.sort_index AS model_index,
            mi.stage_index AS miniature_index,
            mi.amount AS miniature_amount
        FROM groups g
        LEFT JOIN models m ON g.group_id = m.group_id
        LEFT JOIN miniatures mi ON m.model_id = mi.model_id
        WHERE 
            g.user_id = :user_id;
    ";

    // Prepare and execute the query
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $responseData = [];
    foreach ($results as $row) {
        // Check if group already exists in responseData
        $groupId = $row['group_id'];
        if (!isset($responseData[$groupId])) {
            $responseData[$groupId] = [
                'id' => $groupId,
                'name' => $row['group_name'],
                'sorting' => $row['group_index'],
                'models' => []
            ];
        }

        // Check if model already exists under the current group
        $modelId = $row['model_id'];
        if (!isset($responseData[$groupId]['models'][$modelId])) {
            if (!is_null($modelId)) {
                $responseData[$groupId]['models'][$modelId] = [
                    'id' => $modelId,
                    'name' => $row['model_name'],
                    'sorting' => $row['model_index'],
                    'miniatures' => []
                ];
            }
        }

        if (!is_null($modelId) && !is_null($row['miniature_index'])) {
            // Add miniatures under the model
            $responseData[$groupId]['models'][$modelId]['miniatures'][] = [
                'index' => $row['miniature_index'],
                'amount' => $row['miniature_amount'] ?? 0
            ];
        }
    }

    // Convert associative 'models' array to indexed array
    foreach ($responseData as &$group) {
        $group['models'] = array_values($group['models']);
    }

    // Return the structured response as JSON
    $response->getBody()->write(json_encode(array_values($responseData), JSON_PRETTY_PRINT));
    return $response;
})->add($tokenMiddleware);

$app->put("/groups/{groupId}", function (Request $request, Response $response, array $args) use ($pdo) {

    $body = $request->getBody();
    $data = json_decode($body, true);

    // Check if name is provided in the payload
    if (!isset($data['name'])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Name is required']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }

    $userId = $request->getAttribute('firebaseUser');
    $groupId = $args['groupId'];
    $name = $data['name'];

    $sql = "
        UPDATE groups g
        SET name = :name
        WHERE 
            g.user_id = :user_id AND g.group_id = :group_id;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':group_id', $groupId);
    $stmt->bindParam(':name', $name);

    if ($stmt->execute()) {
        // Return the created collection
        $response->getBody()->write(json_encode([
            'id' => $groupId,
            'name' => $name,
        ], JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to update group'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);

$app->delete("/groups/{groupId}", function (Request $request, Response $response, array $args) use ($pdo) {
    $userId = $request->getAttribute('firebaseUser');
    $groupId = $args['groupId'];

    $sql = "
        DELETE FROM groups
        WHERE 
            groups.user_id = :user_id AND groups.group_id = :group_id;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':group_id', $groupId);

    if ($stmt->execute()) {
        // Return the created collection
        return $response->withHeader('Content-Type', 'application/json')->withStatus(204);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to delete group'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);