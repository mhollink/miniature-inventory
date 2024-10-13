<?php

namespace App\services\model;

use App\services\BaseService;
use Slim\Psr7\Response as SlimResponse;

class ModelService extends BaseService
{
    private ModelValidations $modelValidations;
    private ModelRepository $modelRepository;

    public function __construct(
        ModelValidations $modelValidations,
        ModelRepository  $modelRepository
    )
    {
        $this->modelValidations = $modelValidations;
        $this->modelRepository = $modelRepository;
    }

    public function createModel(string $groupId, mixed $payload, string $userId)
    {
        $response = $this->modelValidations->validateRequest($payload);
        if (!is_null($response)) return $response;

        $modelId = $this->modelRepository->createModel($groupId, $payload, $userId);

        if (is_null($modelId)) {
            return $this->errorResponse('Failed to create Model');
        }

        $this->modelRepository->upsertLastInteractions($userId, "Create Model");

        return $this->response([
            'id' => $modelId,
            'name' => $payload['name'],
            'miniatures' => $payload['miniatures']
        ], 201);
    }

    public function updateModel(string $modelId, mixed $payload, string $userId): SlimResponse
    {
        $response = $this->modelValidations->validateRequest($payload);
        if (!is_null($response)) return $response;

        $updatedRows = $this->modelRepository->updateModel($modelId, $payload, $userId);

        if (is_null($updatedRows)) {
            return $this->errorResponse('Failed to update Model');
        }
        if ($updatedRows == 0) {
            return $this->errorResponse('Nothing has been updated', 200);
        }

        $this->modelRepository->upsertLastInteractions($userId, "Update Model");

        $response = new SlimResponse();
        $response->getBody()->write(json_encode([
            'id' => $modelId,
            'name' => $payload['name'],
            'miniatures' => $payload['miniatures']
        ], JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function deleteModel(string $modelId, string $userId)
    {
        $success = $this->modelRepository->deleteModel($modelId, $userId);

        if (!$success) {
            return $this->errorResponse('Failed to delete Model');
        }

        $this->modelRepository->upsertLastInteractions($userId, "Delete Model");

        $response = new SlimResponse();
        return $response->withHeader('Content-Type', 'application/json')->withStatus(204);
    }

}