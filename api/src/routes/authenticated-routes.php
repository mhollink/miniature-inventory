<?php

global $modelService, $paintService, $supportValidations, $workflowService;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteCollectorProxy;

global $app, $tokenMiddleware, $collectionService, $groupService;

// This bunch of methods require authentication with the Firebase IDP.
$app->group("", function (RouteCollectorProxy $group) {

    $group->group("/collections", function (RouteCollectorProxy $group) {
        global $collectionService, $groupService;

        $group->post("", function (Request $request) use ($collectionService) {
            $userId = $request->getAttribute('firebaseUser');
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $collectionService->createCollection($data, $userId);
        });
        $group->get("", function (Request $request) use ($collectionService) {
            $userId = $request->getAttribute('firebaseUser');

            return $collectionService->findAllCollectionsForUser($userId);
        });
        $group->patch("", function (Request $request) use ($collectionService) {
            $userId = $request->getAttribute('firebaseUser');
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $collectionService->reorderGroupsInCollections($data, $userId);
        });
        $group->put("/{collectionId}", function (Request $request, Response $response, array $args) use ($collectionService) {
            $userId = $request->getAttribute('firebaseUser');
            $collectionId = $args['collectionId'];
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $collectionService->updateCollection($collectionId, $data, $userId);
        });
        $group->delete("/{collectionId}", function (Request $request, Response $response, array $args) use ($collectionService) {
            $userId = $request->getAttribute('firebaseUser');
            $collectionId = $args['collectionId'];

            return $collectionService->deleteCollection($collectionId, $userId);
        });
        $group->post("/{collectionId}/groups", function (Request $request, Response $response, array $args) use ($groupService) {
            $userId = $request->getAttribute('firebaseUser');
            $collectionId = $args['collectionId'];
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $groupService->createGroup($collectionId, $data, $userId);
        });
    });

    $group->group("/groups", function (RouteCollectorProxy $group) {
        global $groupService, $modelService;

        $group->get('', function (Request $request) use ($groupService) {
            $userId = $request->getAttribute('firebaseUser');

            return $groupService->findAllGroupsForUser($userId);
        });
        $group->put("/{groupId}", function (Request $request, Response $response, array $args) use ($groupService) {
            $userId = $request->getAttribute('firebaseUser');
            $groupId = $args['groupId'];
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $groupService->updateGroup($groupId, $data, $userId);
        });
        $group->patch("/{groupId}", function (Request $request, Response $response, array $args) use ($groupService) {
            $userId = $request->getAttribute('firebaseUser');
            $groupId = $args['groupId'];
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $groupService->reorderModels($groupId, $data, $userId);
        });
        $group->delete("/{groupId}", function (Request $request, Response $response, array $args) use ($groupService) {
            $userId = $request->getAttribute('firebaseUser');
            $groupId = $args['groupId'];

            return $groupService->deleteGroup($groupId, $userId);
        });
        $group->post("/{groupId}/models", function (Request $request, Response $response, array $args) use ($modelService) {
            $userId = $request->getAttribute('firebaseUser');
            $groupId = $args['groupId'];
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $modelService->createModel($groupId, $data, $userId);
        });
    });

    $group->group("/models", function ($group) {
        global $modelService;

        $group->put("/{modelId}", function (Request $request, Response $response, array $args) use ($modelService) {
            $userId = $request->getAttribute('firebaseUser');
            $modelId = $args['modelId'];
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $modelService->updateModel($modelId, $data, $userId);
        });
        $group->delete("/{modelId}", function (Request $request, Response $response, array $args) use ($modelService) {
            $userId = $request->getAttribute('firebaseUser');
            $modelId = $args['modelId'];

            return $modelService->deleteModel($modelId, $userId);
        });
    });

    $group->group("/paints", function (RouteCollectorProxy $group) {
        global $paintService;

        $group->post('', function (Request $request) use ($paintService) {
            $userId = $request->getAttribute('firebaseUser');
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $paintService->createPaint($data, $userId);
        });
        $group->get('', function (Request $request) use ($paintService) {
            $userId = $request->getAttribute('firebaseUser');

            return $paintService->getAllPaints($userId);
        });
        $group->delete('', function (Request $request) use ($paintService) {
            $userId = $request->getAttribute('firebaseUser');

            $body = $request->getBody();
            $data = json_decode($body, true);

            return $paintService->deletePaints($data, $userId);
        });
    });

    $group->group("/workflow", function (RouteCollectorProxy $group) {
        global $workflowService;

        $group->get('', function (Request $request) use ($workflowService) {
            $userId = $request->getAttribute('firebaseUser');
            return $workflowService->getWorkflow($userId);
        });
        $group->post('', function (Request $request) use ($workflowService) {
            $userId = $request->getAttribute('firebaseUser');
            $body = $request->getBody();
            $data = json_decode($body, true);

            return $workflowService->setWorkflow($data, $userId);
        });
    });

    $group->get('/profile', function (Request $request, Response $response) {
        global $supportValidations;

        $firebaseUserId = $request->getAttribute('firebaseUser');
        $verified = $request->getAttribute('verified');

        $support = $supportValidations->getSupporterLevel($firebaseUserId);

        $payload = ['userId' => $firebaseUserId, 'verified' => $verified, 'support' => $support];
        $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json');
    });

})->add($tokenMiddleware);
