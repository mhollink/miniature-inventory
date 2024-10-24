<?php


use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Psr7\Response as SlimResponse;

global $app, $tokenMiddleware, $pdo;

$app->get('/user-statistics', function (Request $request, Response $response) use ($pdo) {

    $key = $request->getQueryParams()['apiKey'] ?? null;
    if ($key != $_ENV['API_KEY']) {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode(["error" => "apiKey is invalid"], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(403);
    }

    $sql = "
        SELECT combined.user_id,
               SUM(CASE WHEN source_table = 'collections' THEN item_count ELSE 0 END) AS collections,
               SUM(CASE WHEN source_table = 'groups' THEN item_count ELSE 0 END) AS groups,
               SUM(CASE WHEN source_table = 'models' THEN item_count ELSE 0 END) AS models,
               SUM(CASE WHEN source_table = 'paints' THEN item_count ELSE 0 END) AS paints,
               SUM(CASE WHEN source_table = 'miniatures' THEN item_count ELSE 0 END) AS miniatures,
               SUM(CASE WHEN source_table = 'miniatures' THEN filtered_amount ELSE 0 END) AS completed_miniatures,
               li.action_time
        FROM (
            SELECT user_id, COUNT(*) AS item_count, NULL AS filtered_amount, 'collections' AS source_table 
            FROM collections 
            GROUP BY user_id
        
            UNION ALL
        
            SELECT user_id, COUNT(*) AS item_count, NULL AS filtered_amount, 'groups' AS source_table 
            FROM groups 
            GROUP BY user_id
        
            UNION ALL
        
            SELECT user_id, COUNT(*) AS item_count, NULL AS filtered_amount, 'models' AS source_table 
            FROM models 
            GROUP BY user_id
        
            UNION ALL
        
            SELECT user_id, COUNT(*) AS item_count, NULL AS filtered_amount, 'paints' AS source_table 
            FROM paints 
            GROUP BY user_id
        
            UNION ALL
        
            SELECT m.user_id, 
                   SUM(m.amount) AS item_count, 
                   SUM(CASE WHEN m.stage_index = ms.max_stage THEN m.amount ELSE 0 END) AS filtered_amount,
                   'miniatures' AS source_table
            FROM miniatures AS m
            JOIN (
                SELECT user_id, MAX(stage_index) AS max_stage
                FROM miniatures
                GROUP BY user_id
            ) AS ms ON m.user_id = ms.user_id
            GROUP BY m.user_id
        ) AS combined
        LEFT JOIN last_interaction li ON combined.user_id = li.user_id
        GROUP BY combined.user_id
        ORDER BY completed_miniatures DESC, miniatures DESC
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $response->getBody()->write(json_encode($result, JSON_UNESCAPED_UNICODE));
    return $response;
});
