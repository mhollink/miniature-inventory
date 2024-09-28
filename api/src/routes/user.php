<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

global $app, $tokenMiddleware, $pdo;

function getSupporterLevel($pdo, $userId)
{
    $sql = "
        SELECT `level`
        FROM donators u
        WHERE u.user_id = :user_id;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (isset($result) && is_array($result)) return $result['level'];
    else return 'none';
}

$app->get('/profile', function (Request $request, Response $response) use ($pdo) {
    $firebaseUserId = $request->getAttribute('firebaseUser');
    $verified = $request->getAttribute('verified');

    $support = getSupporterLevel($pdo, $firebaseUserId);

    $payload = ['userId' => $firebaseUserId, 'verified' => $verified, 'support' => $support];
    $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
    return $response;
})->add($tokenMiddleware);

$app->get('/workflow', function (Request $request, Response $response) use ($pdo) {
    $userId = $request->getAttribute('firebaseUser');

    $sql = "
        SELECT s.stage_index as `index`, name
        FROM workflow_stages s
        WHERE s.user_id = :user_id;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($result)) {
        $response->getBody()->write(json_encode($result, JSON_UNESCAPED_UNICODE));
    } else {
        $response->getBody()->write(json_encode([
            ["index" => "0", "name" => "Not started"],
            ["index" => "1", "name" => "Primed"],
            ["index" => "2", "name" => "Painted"],
            ["index" => "3", "name" => "Based"],
            ["index" => "4", "name" => "Finished"]
        ], JSON_UNESCAPED_UNICODE));
    }

    return $response;
})->add($tokenMiddleware);

$app->post('/workflow', function (Request $request, Response $response) use ($pdo) {
    $userId = $request->getAttribute('firebaseUser');

    $pdo->beginTransaction();

    $sql = "
        DELETE FROM workflow_stages
        WHERE workflow_stages.user_id = :user_id;
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $body = $request->getBody();
    $data = json_decode($body, true);

    // Generate an insert sql command for the miniatures;
    $sqlStages = "INSERT INTO workflow_stages (user_id, stage_index, name) VALUES ";
    $placeholders = [];
    $values = [];
    foreach ($data['stages'] as $index => $stage) {
        $placeholders[] = "(:user_id{$index}, :stage_index{$index}, :name{$index})";

        // Bind values, using the new model ID
        $values["user_id{$index}"] = $userId;
        $values["stage_index{$index}"] = strval($index);
        $values["name{$index}"] = $stage;
    }
    // Complete the SQL query
    $sqlStages .= implode(", ", $placeholders);

    // Prepare and execute the miniatures insertion query
    $stmtStages = $pdo->prepare($sqlStages);
    $stmtStages->execute($values);

    // Delete miniatures in stages that were deleted
    $stageCap = sizeof($data['stages']) -1;
    $sqlMiniatures = "
        DELETE FROM `miniatures` 
        WHERE `user_id` = :user_id AND `stage_index` > :stage_max
    ";
    $stmtMiniatures = $pdo->prepare($sqlMiniatures);
    $stmtMiniatures->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmtMiniatures->bindParam(':stage_max', $stageCap, PDO::PARAM_INT);
    $stmtMiniatures->execute();

    if ($pdo->commit()) {
        $mappedStages = array_map(function($value, $index) {
            return [
                "index" => $index, // Convert index to string
                "name" => $value
            ];
        }, $data['stages'], array_keys($data['stages']));
        $response->getBody()->write(json_encode($mappedStages, JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    } else {
        $pdo->rollBack();
        $response->getBody()->write(json_encode(['error' => 'Failed to create group'], JSON_PRETTY_PRINT));
        return $response->withStatus(500);
    }

})->add($tokenMiddleware);