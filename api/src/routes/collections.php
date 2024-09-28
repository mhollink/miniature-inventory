<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Response as SlimResponse;

global $app, $tokenMiddleware, $pdo;

$app->post("/collections", function (Request $request, Response $response) use ($pdo) {

    $body = $request->getBody();
    $data = json_decode($body, true);

    // Check if name is provided in the payload
    if (!isset($data['name'])) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([['message' => 'Name is required']], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(400);
    }

    $userId = $request->getAttribute('firebaseUser');
    $collectionId = Uuid::uuid4()->toString();
    $name = $data['name'];

    $support = getSupporterLevel($pdo, $userId);
    if ($support == 'none') {
        $stmtColCount = $pdo->prepare("SELECT COUNT(*) AS item_count FROM `collections` WHERE user_id = :user_id");
        $stmtColCount->bindParam(':user_id', $userId);
        $stmtColCount->execute();
        $result = $stmtColCount->fetch();
        $itemCount = $result['item_count'];
        if ($itemCount >= 3) {
            $response->getBody()->write(json_encode(['error' => 'Failed to create collection, support is required to create more than 3 collections'], JSON_PRETTY_PRINT));
            return $response->withStatus(409);
        }
    }

    $sql = "
        INSERT INTO collections (user_id, collection_id, name) 
        VALUES (:user_id, :collection_id, :name)
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':collection_id', $collectionId);
    $stmt->bindParam(':name', $name);

    if ($stmt->execute()) {
        // Return the created collection
        $response->getBody()->write(json_encode([
            'id' => $collectionId,
            'name' => $name,
        ], JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to create collection'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);

$app->get('/collections', function (Request $request, Response $response) use ($pdo) {
    $userId = $request->getAttribute('firebaseUser');

    $sql = "
        SELECT 
            c.collection_id,
            c.name AS collection_name,
            g.group_id,
            g.name AS group_name,         
            g.sort_index AS group_index
        FROM collections c
        LEFT JOIN groups g ON c.collection_id = g.collection_id
        WHERE 
            c.user_id = :user_id;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $responseData = [];
    foreach ($result as $row) {
        // Get the collection_id for each row
        // If this collection is not yet added to the result array, add it
        $collectionId = $row['collection_id'];

        if (!isset($responseData[$collectionId])) {
            $responseData[$collectionId] = [
                'id' => $collectionId,
                'name' => $row['collection_name'],
                'groups' => []
            ];
        }

        // Add the group if it's not null (a collection can have no groups)
        if (!is_null($row['group_id'])) {
            $responseData[$collectionId]['groups'][] = [
                'id' => $row['group_id'],
                'name' => $row['group_name'],
                'sorting' => $row['group_index']
            ];
        }
    }

    // Convert the result array back into a numerically indexed array
    $responseData = array_values($responseData);

    $response->getBody()->write(json_encode($responseData, JSON_UNESCAPED_UNICODE));
    return $response;
})->add($tokenMiddleware);

$app->put("/collections/{collectionId}", function (Request $request, Response $response, array $args) use ($pdo) {

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
    $name = $data['name'];

    $sql = "
        UPDATE collections c
        SET name = :name
        WHERE 
            c.user_id = :user_id AND c.collection_id = :collection_id;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':collection_id', $collectionId);
    $stmt->bindParam(':name', $name);

    if ($stmt->execute()) {
        // Return the created collection
        $response->getBody()->write(json_encode([
            'id' => $collectionId,
            'name' => $name,
        ], JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to update collection'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);

$app->delete("/collections/{collectionId}", function (Request $request, Response $response, array $args) use ($pdo) {
    $userId = $request->getAttribute('firebaseUser');
    $collectionId = $args['collectionId'];

    $sql = "
        DELETE FROM collections
        WHERE 
            collections.user_id = :user_id AND collections.collection_id = :collection_id;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':collection_id', $collectionId);

    if ($stmt->execute()) {
        // Return the created collection
        return $response->withHeader('Content-Type', 'application/json')->withStatus(204);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to delete collection'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }
})->add($tokenMiddleware);