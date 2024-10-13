<?php

namespace Tests\services\collection;

use App\services\collection\CollectionMapper;
use App\services\collection\CollectionRepository;
use App\services\collection\CollectionService;
use App\services\collection\CollectionValidations;
use App\services\user\SupportValidations;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Response as SlimResponse;

class CollectionServiceTest extends TestCase
{
    private CollectionService $collectionService;
    private CollectionRepository $repositoryMock;
    private CollectionMapper $mapperMock;
    private CollectionValidations $validationsMock;
    private SupportValidations $supportValidationsMock;

    protected function setUp(): void
    {
        $this->repositoryMock = $this->createMock(CollectionRepository::class);
        $this->mapperMock = $this->createMock(CollectionMapper::class);
        $this->validationsMock = $this->createMock(CollectionValidations::class);
        $this->supportValidationsMock = $this->createMock(SupportValidations::class);

        $this->collectionService = new CollectionService(
            $this->repositoryMock,
            $this->mapperMock,
            $this->validationsMock,
            $this->supportValidationsMock
        );
    }

    public function testCreateCollectionSuccessfully(): void
    {
        $payload = ['name' => 'New Collection'];
        $userId = 'user123';
        $collectionId = '550e8400-e29b-41d4-a716-446655440000';

        $this->supportValidationsMock
            ->expects($this->once())
            ->method('validateCanCreateCollection')
            ->with($userId)
            ->willReturn(null);

        $this->validationsMock
            ->expects($this->once())
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn(null);

        $this->repositoryMock
            ->expects($this->once())
            ->method('createCollection')
            ->with($payload['name'], $userId)
            ->willReturn($collectionId);

        $this->repositoryMock
            ->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, 'Create Collection');

        $response = $this->collectionService->createCollection($payload, $userId);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['id' => $collectionId, 'name' => 'New Collection'], JSON_PRETTY_PRINT),
            (string)$response->getBody()
        );
    }

    public function testCreateCollectionFailsOnValidation(): void
    {
        $payload = ['name' => 'New Collection'];
        $userId = 'user123';

        $errorResponse = new SlimResponse();
        $errorResponse->getBody()->write('Validation error');
        $errorResponse = $errorResponse->withStatus(400);

        $this->supportValidationsMock
            ->expects($this->once())
            ->method('validateCanCreateCollection')
            ->with($userId)
            ->willReturn(null);

        $this->validationsMock
            ->expects($this->once())
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn($errorResponse);

        $response = $this->collectionService->createCollection($payload, $userId);

        $this->assertEquals(400, $response->getStatusCode());
        $this->assertEquals('Validation error', (string)$response->getBody());
    }

    public function testCreateCollectionFails(): void
    {
        $payload = ['name' => 'New Collection'];
        $userId = 'user123';

        $this->supportValidationsMock
            ->expects($this->once())
            ->method('validateCanCreateCollection')
            ->with($userId)
            ->willReturn(null);

        $this->validationsMock
            ->expects($this->once())
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn(null);

        $this->repositoryMock
            ->expects($this->once())
            ->method('createCollection')
            ->with($payload['name'], $userId)
            ->willReturn(null);

        $response = $this->collectionService->createCollection($payload, $userId);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals('{"error":"Failed to create collection"}', (string)$response->getBody());

    }

    public function testFindAllCollectionsForUser(): void
    {
        $userId = 'user123';
        $rawDatabaseRows = [
            ['collection_id' => '1', 'collection_name' => 'Collection 1'],
            ['collection_id' => '2', 'collection_name' => 'Collection 2']
        ];

        $mappedCollections = [
            ['id' => '1', 'name' => 'Collection 1', 'groups' => []],
            ['id' => '2', 'name' => 'Collection 2', 'groups' => []]
        ];

        $this->repositoryMock
            ->expects($this->once())
            ->method('findCollectionsByUserId')
            ->with($userId)
            ->willReturn($rawDatabaseRows);

        $this->mapperMock
            ->expects($this->once())
            ->method('mapResultToCollectionsWithGroups')
            ->with($rawDatabaseRows)
            ->willReturn($mappedCollections);

        $response = $this->collectionService->findAllCollectionsForUser($userId);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($mappedCollections, JSON_UNESCAPED_UNICODE),
            (string)$response->getBody()
        );
    }

    public function testUpdateCollectionSuccessfully(): void
    {
        $collectionId = '550e8400-e29b-41d4-a716-446655440000';
        $payload = ['name' => 'Updated Collection'];
        $userId = 'user123';

        $this->validationsMock
            ->expects($this->once())
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn(null);

        $this->repositoryMock
            ->expects($this->once())
            ->method('updateCollection')
            ->with($collectionId, $payload['name'], $userId)
            ->willReturn(1);

        $this->repositoryMock
            ->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, 'Update Collection');

        $response = $this->collectionService->updateCollection($collectionId, $payload, $userId);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['id' => $collectionId, 'name' => $payload['name']], JSON_PRETTY_PRINT),
            (string)$response->getBody()
        );
    }

    public function testUpdateCollectionFailsOnValidation(): void
    {
        $collectionId = '550e8400-e29b-41d4-a716-446655440000';
        $payload = ['name' => 'Updated Collection'];
        $userId = 'user123';

        $errorResponse = new SlimResponse();
        $errorResponse->getBody()->write('Validation error');
        $errorResponse = $errorResponse->withStatus(400);

        $this->validationsMock
            ->expects($this->once())
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn($errorResponse);

        $response = $this->collectionService->updateCollection($collectionId, $payload, $userId);

        $this->assertEquals(400, $response->getStatusCode());
        $this->assertEquals('Validation error', (string)$response->getBody());
    }

    public function testUpdateCollectionFailsToUpdate(): void
    {
        $collectionId = '550e8400-e29b-41d4-a716-446655440000';
        $payload = ['name' => 'Updated Collection'];
        $userId = 'user123';

        $this->validationsMock
            ->expects($this->once())
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn(null);

        $this->repositoryMock
            ->expects($this->once())
            ->method('updateCollection')
            ->with($collectionId, $payload['name'], $userId)
            ->willReturn(null);

        $response = $this->collectionService->updateCollection($collectionId, $payload, $userId);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals('{"error":"Failed to update collection"}', (string)$response->getBody());
    }

    public function testUpdateCollectionFailsOnNoRowsUpdated(): void
    {
        $collectionId = '550e8400-e29b-41d4-a716-446655440000';
        $payload = ['name' => 'Updated Collection'];
        $userId = 'user123';

        $this->validationsMock
            ->expects($this->once())
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn(null);

        $this->repositoryMock
            ->expects($this->once())
            ->method('updateCollection')
            ->with($collectionId, $payload['name'], $userId)
            ->willReturn(0);

        $response = $this->collectionService->updateCollection($collectionId, $payload, $userId);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('{"error":"Nothing has been updated"}', (string)$response->getBody());
    }

    public function testDeleteCollectionSuccessfully(): void
    {
        $collectionId = '550e8400-e29b-41d4-a716-446655440000';
        $userId = 'user123';

        $this->repositoryMock
            ->expects($this->once())
            ->method('deleteCollection')
            ->with($collectionId, $userId)
            ->willReturn(true);

        $this->repositoryMock
            ->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, 'Delete Collection');

        $response = $this->collectionService->deleteCollection($collectionId, $userId);

        $this->assertEquals(204, $response->getStatusCode());
        $this->assertEquals('', (string)$response->getBody());
    }

    public function testDeleteCollectionFails(): void
    {
        $collectionId = '550e8400-e29b-41d4-a716-446655440000';
        $userId = 'user123';

        $this->repositoryMock
            ->expects($this->once())
            ->method('deleteCollection')
            ->with($collectionId, $userId)
            ->willReturn(false);

        $response = $this->collectionService->deleteCollection($collectionId, $userId);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals('{"error":"Failed to delete collection"}', (string)$response->getBody());
    }


    public function testValidationFailureReturnsErrorResponse()
    {
        $payload = ['groups' => []];
        $userId = 'user123';

        $mockResponse = new SlimResponse();
        $mockResponse->getBody()->write(json_encode(['message' => 'Invalid payload']));
        $mockResponse = $mockResponse->withStatus(400);

        $this->validationsMock
            ->expects($this->once())
            ->method('validateSortingParams')
            ->with($payload)
            ->willReturn($mockResponse);

        $response = $this->collectionService->reorderGroupsInCollections($payload, $userId);
        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());

        $body = json_decode((string)$response->getBody(), true);
        $this->assertEquals('Invalid payload', $body['message']);
    }

    public function testReorderGroupsFailsReturnsErrorResponse()
    {
        $payload = [
            'groups' => [
                ['groupId' => 1, 'collectionId' => 2, 'index' => 1]
            ]
        ];
        $userId = 'user123';

        $this->validationsMock
            ->expects($this->once())
            ->method('validateSortingParams')
            ->with($payload)
            ->willReturn(null);

        $this->repositoryMock
            ->expects($this->once())
            ->method('reorderGroupsInCollection')
            ->with($payload['groups'], $userId)
            ->willReturn(false);

        $response = $this->collectionService->reorderGroupsInCollections($payload, $userId);
        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());

        $body = json_decode((string)$response->getBody(), true);
        $this->assertEquals('Failed to update ordering of groups', $body['error']);
    }

    public function testReorderGroupsSucceedsReturns204()
    {
        $payload = [
            'groups' => [
                ['groupId' => 1, 'collectionId' => 2, 'index' => 1]
            ]
        ];
        $userId = 'user123';

        $this->validationsMock
            ->expects($this->once())
            ->method('validateSortingParams')
            ->with($payload)
            ->willReturn(null);

        $this->repositoryMock
            ->expects($this->once())
            ->method('reorderGroupsInCollection')
            ->with($payload['groups'], $userId)
            ->willReturn(true);

        $this->repositoryMock
            ->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, 'Update Collection');
       
        $response = $this->collectionService->reorderGroupsInCollections($payload, $userId);
        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(204, $response->getStatusCode());
        $this->assertEmpty((string)$response->getBody());
    }
}

