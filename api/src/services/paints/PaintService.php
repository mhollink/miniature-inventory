<?php

namespace App\services\paints;

use App\services\BaseService;
use Slim\Psr7\Response as SlimResponse;

class PaintService extends BaseService
{
    private PaintValidations $paintValidations;
    private PaintRepository $paintRepository;

    public function __construct(PaintValidations $paintValidations, PaintRepository $paintRepository)
    {
        $this->paintValidations = $paintValidations;
        $this->paintRepository = $paintRepository;
    }

    public function createPaint(mixed $payload, string $userId): SlimResponse
    {
        $response = $this->paintValidations->validateContainsPaintFields($payload);
        if (!is_null($response)) return $response;

        try {
            $paintId = $this->paintRepository->createPaint($payload, $userId);

            if (is_null($paintId)) {
                return $this->errorResponse('Failed to create Paint');
            }

            $this->paintRepository->upsertLastInteractions($userId, "Create Paint");
            return $this->response(array_merge(['id' => $paintId], $payload), 201);
        } catch (PaintAlreadyInStorageException $e) {
            return $this->errorResponse($e->getMessage(), 409);
        }
    }

    public function getAllPaints(string $userId): SlimResponse
    {
        $paints = $this->paintRepository->getAllPaintsForUser($userId);

        return $this->response($paints);
    }

    public function deletePaints(mixed $payload, string $userId): SlimResponse
    {
        $response = $this->paintValidations->validateHasIdsArray($payload);
        if (!is_null($response)) return $response;

        $success = $this->paintRepository->deletePaints($payload['ids'], $userId);
        if (!$success) {
            return $this->errorResponse('Failed to delete the Paint(s)');
        }

        $response = new SlimResponse();
        return $response->withHeader('Content-Type', 'application/json')->withStatus(204);
    }
}