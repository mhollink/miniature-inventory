<?php

namespace Tests\services\group;

use App\services\group\GroupService;
use App\services\group\GroupRepository;
use App\services\group\GroupMapper;
use App\services\group\GroupValidations;
use App\services\user\SupportValidations;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Response;
use Psr\Http\Message\ResponseInterface;

class GroupServiceTest extends TestCase
{
    private GroupRepository $groupRepository;
    private GroupMapper $groupMapper;
    private GroupValidations $groupValidations;
    private SupportValidations $supportValidations;
    private GroupService $groupService;

    protected function setUp(): void
    {
        $this->groupRepository = $this->createMock(GroupRepository::class);
        $this->groupMapper = $this->createMock(GroupMapper::class);
        $this->groupValidations = $this->createMock(GroupValidations::class);
        $this->supportValidations = $this->createMock(SupportValidations::class);

        $this->groupService = new GroupService(
            $this->groupRepository,
            $this->groupMapper,
            $this->groupValidations,
            $this->supportValidations
        );
    }

    public function testCreateGroupSuccess()
    {
        $userId = '1';
        $collectionId = 'collection-123';
        $payload = ['name' => 'New Group'];

        $this->supportValidations
            ->method('validateCanCreateGroup')
            ->willReturn(null);

        $this->groupValidations
            ->method('validateNameIsSet')
            ->willReturn(null);

        $this->groupRepository
            ->method('createGroup')
            ->willReturn('group-123');

        $this->groupRepository
            ->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, 'Create Group');

        $response = $this->groupService->createGroup($collectionId, $payload, $userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
    }

    public function testCreateGroupValidationFailure()
    {
        $userId = '1';
        $collectionId = 'collection-123';
        $payload = ['name' => 'New Group'];

        $mockResponse = $this->createMock(Response::class);
        $this->supportValidations
            ->method('validateCanCreateGroup')
            ->willReturn($mockResponse);

        $response = $this->groupService->createGroup($collectionId, $payload, $userId);

        $this->assertSame($mockResponse, $response);
    }

    public function testCreateGroupFailsToCreateGroup()
    {
        $userId = '1';
        $collectionId = 'collection-123';
        $payload = ['name' => 'New Group'];

        $this->supportValidations
            ->method('validateCanCreateGroup')
            ->willReturn(null);

        $this->groupValidations
            ->method('validateNameIsSet')
            ->willReturn(null);

        $this->groupRepository
            ->method('createGroup')
            ->willReturn(null);

        $response = $this->groupService->createGroup($collectionId, $payload, $userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
    }


    public function testFindAllGroupsForUser()
    {
        $userId = '1';
        $mockResults = [
            ['group_id' => '1', 'group_name' => 'Group 1', 'group_index' => 1],
            ['group_id' => '2', 'group_name' => 'Group 2', 'group_index' => 2],
        ];
        $expectedMappedResult = [
            ['id' => '1', 'name' => 'Group 1', 'models' => []],
            ['id' => '2', 'name' => 'Group 2', 'models' => []],
        ];

        $this->groupRepository
            ->method('findAllGroupsByUserId')
            ->with($userId)
            ->willReturn($mockResults);

        $this->groupMapper
            ->method('mapResultToGroupsWithModelsAndMiniatures')
            ->with($mockResults)
            ->willReturn($expectedMappedResult);

        $response = $this->groupService->findAllGroupsForUser($userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testUpdateGroupSuccess()
    {
        $groupId = 'group-123';
        $userId = 'user-1';
        $payload = ['name' => 'Updated Group Name'];

        $this->groupValidations
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn(null);

        $this->groupRepository
            ->method('updateGroup')
            ->with($groupId, $payload['name'], $userId)
            ->willReturn(1);

        $this->groupRepository
            ->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, 'Update Group');

        $response = $this->groupService->updateGroup($groupId, $payload, $userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testUpdateGroupValidationFailure()
    {
        $groupId = 'group-123';
        $userId = 'user-1';
        $payload = ['name' => 'Updated Group Name'];

        $mockResponse = $this->createMock(Response::class);
        $this->groupValidations
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn($mockResponse);

        $response = $this->groupService->updateGroup($groupId, $payload, $userId);

        $this->assertSame($mockResponse, $response);
    }

    public function testUpdateGroupNoRowsUpdated()
    {
        $groupId = 'group-123';
        $userId = 'user-1';
        $payload = ['name' => 'Updated Group Name'];

        $this->groupValidations
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn(null);

        $this->groupRepository
            ->method('updateGroup')
            ->with($groupId, $payload['name'], $userId)
            ->willReturn(0);

        $response = $this->groupService->updateGroup($groupId, $payload, $userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString('Nothing has been updated', (string) $response->getBody());
    }

    public function testUpdateGroupFailure()
    {
        $groupId = 'group-123';
        $userId = 'user-1';
        $payload = ['name' => 'Updated Group Name'];

        $this->groupValidations
            ->method('validateNameIsSet')
            ->with($payload)
            ->willReturn(null);

        $this->groupRepository
            ->method('updateGroup')
            ->with($groupId, $payload['name'], $userId)
            ->willReturn(null);

        $response = $this->groupService->updateGroup($groupId, $payload, $userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertStringContainsString('Failed to update Group', (string) $response->getBody());
    }

    public function testDeleteGroupSuccess()
    {
        $groupId = 'group-123';
        $userId = 'user-1';

        $this->groupRepository
            ->method('deleteGroup')
            ->with($groupId, $userId)
            ->willReturn(true);

        $this->groupRepository
            ->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, 'Delete Group');

        $response = $this->groupService->deleteGroup($groupId, $userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(204, $response->getStatusCode());
        $this->assertEmpty((string) $response->getBody());
    }

    public function testDeleteGroupFailure()
    {
        $groupId = 'group-123';
        $userId = 'user-1';

        $this->groupRepository
            ->method('deleteGroup')
            ->with($groupId, $userId)
            ->willReturn(false);

        $response = $this->groupService->deleteGroup($groupId, $userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertStringContainsString('Failed to delete Group', (string) $response->getBody());
    }

    public function testReorderModelsSuccess()
    {
        $groupId = 'group-123';
        $userId = 'user-1';
        $payload = [
            'models' => [
                ['id' => 'model-1', 'index' => 1],
                ['id' => 'model-2', 'index' => 2],
            ]
        ];

        $this->groupValidations
            ->method('validateSortingParams')
            ->with($payload)
            ->willReturn(null);

        $this->groupRepository
            ->method('reorderModelsInGroup')
            ->with($groupId, $payload['models'], $userId)
            ->willReturn(true);

        $this->groupRepository
            ->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, 'Update Group');

        $response = $this->groupService->reorderModels($groupId, $payload, $userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(204, $response->getStatusCode());
        $this->assertEmpty((string) $response->getBody());
    }

    public function testReorderModelsValidationError()
    {
        $groupId = 'group-123';
        $userId = 'user-1';
        $payload = [
            'models' => [
                ['id' => 'model-1', 'index' => 1],
                ['id' => 'model-2', 'index' => 2],
            ]
        ];

        $mockResponse = $this->createMock(Response::class);
        $this->groupValidations
            ->method('validateSortingParams')
            ->with($payload)
            ->willReturn($mockResponse);

        $response = $this->groupService->reorderModels($groupId, $payload, $userId);

        $this->assertSame($mockResponse, $response);
    }

    public function testReorderModelsFailure()
    {
        $groupId = 'group-123';
        $userId = 'user-1';
        $payload = [
            'models' => [
                ['id' => 'model-1', 'index' => 1],
                ['id' => 'model-2', 'index' => 2],
            ]
        ];

        $this->groupValidations
            ->method('validateSortingParams')
            ->with($payload)
            ->willReturn(null);

        $this->groupRepository
            ->method('reorderModelsInGroup')
            ->with($groupId, $payload['models'], $userId)
            ->willReturn(false);

        $response = $this->groupService->reorderModels($groupId, $payload, $userId);

        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertStringContainsString('Failed to update ordering of models', (string) $response->getBody());
    }

}
