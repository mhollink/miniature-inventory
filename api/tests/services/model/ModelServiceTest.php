<?php

namespace Tests\services\model;

use App\services\model\ModelRepository;
use App\services\model\ModelService;
use App\services\model\ModelValidations;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Response as SlimResponse;

class ModelServiceTest extends TestCase
{
    private ModelService $modelService;
    private ModelValidations $modelValidations;
    private ModelRepository $modelRepository;

    protected function setUp(): void
    {
        $this->modelValidations = $this->createMock(ModelValidations::class);
        $this->modelRepository = $this->createMock(ModelRepository::class);

        $this->modelService = new ModelService($this->modelValidations, $this->modelRepository);
    }

    public function testCreateModelReturnsErrorIfValidationFails()
    {
        $userId = 'test-user-id';
        $groupId = 'group-id';
        $payload = [];

        $this->modelValidations->method('validateRequest')->willReturn(new SlimResponse(400));

        $response = $this->modelService->createModel($groupId, $payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testCreateModelReturnsErrorIfCreationFails()
    {
        $userId = 'test-user-id';
        $groupId = 'group-id';
        $payload = ['name' => 'Test Model', 'miniatures' => []];

        $this->modelValidations->method('validateRequest')->willReturn(null);
        $this->modelRepository->method('createModel')->willReturn(null);

        $response = $this->modelService->createModel($groupId, $payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
    }

    public function testCreateModelReturnsSuccess()
    {
        $userId = 'test-user-id';
        $groupId = 'group-id';
        $modelId = 'new-model-id';
        $payload = ['name' => 'Test Model', 'miniatures' => []];

        $this->modelValidations
            ->method('validateRequest')
            ->willReturn(null);
        $this->modelRepository
            ->method('createModel')
            ->willReturn($modelId);
        $this->modelRepository->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, "Create Model");

        $response = $this->modelService->createModel($groupId, $payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals([
            'id' => $modelId,
            'name' => 'Test Model',
            'miniatures' => []
        ], json_decode($response->getBody(), true));
    }

    public function testUpdateModelReturnsErrorIfValidationFails()
    {
        $userId = 'test-user-id';
        $modelId = 'model-id';
        $payload = [];

        $this->modelValidations->method('validateRequest')->willReturn(new SlimResponse(400));

        $response = $this->modelService->updateModel($modelId, $payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testUpdateModelReturnsErrorIfUpdateFails()
    {
        $userId = 'test-user-id';
        $modelId = 'model-id';
        $payload = ['name' => 'Updated Model', 'miniatures' => []];

        $this->modelValidations->method('validateRequest')->willReturn(null);
        $this->modelRepository->method('updateModel')->willReturn(null);

        $response = $this->modelService->updateModel($modelId, $payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
    }

    public function testUpdateModelReturnsSuccess()
    {
        $userId = 'test-user-id';
        $modelId = 'model-id';
        $payload = ['name' => 'Updated Model', 'miniatures' => []];

        $this->modelValidations->method('validateRequest')->willReturn(null);
        $this->modelRepository->method('updateModel')->willReturn(1);
        $this->modelRepository->expects($this->once())
            ->method('upsertLastInteractions')->with($userId, "Update Model");

        $response = $this->modelService->updateModel($modelId, $payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals([
            'id' => $modelId,
            'name' => 'Updated Model',
            'miniatures' => []
        ], json_decode($response->getBody(), true));
    }

    public function testUpdateModelReturnsSuccessWithMessageWhenNothingIsUpdated()
    {
        $userId = 'test-user-id';
        $modelId = 'model-id';
        $payload = ['name' => 'Updated Model', 'miniatures' => []];

        $this->modelValidations->method('validateRequest')->willReturn(null);
        $this->modelRepository->method('updateModel')->willReturn(0);

        $response = $this->modelService->updateModel($modelId, $payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals([
            'error' => 'Nothing has been updated'
        ], json_decode($response->getBody(), true));
    }

    public function testDeleteModelReturnsErrorIfDeleteFails()
    {
        $userId = 'test-user-id';
        $modelId = 'model-id';

        $this->modelRepository->method('deleteModel')->willReturn(false);

        $response = $this->modelService->deleteModel($modelId, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
    }

    public function testDeleteModelReturnsSuccess()
    {
        $userId = 'test-user-id';
        $modelId = 'model-id';

        $this->modelRepository->method('deleteModel')->willReturn(true);
        $this->modelRepository->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, "Delete Model");

        $response = $this->modelService->deleteModel($modelId, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(204, $response->getStatusCode());
    }
}
