<?php

namespace Tests\services\group;

use App\services\group\GroupRepository;
use PDO;
use PDOStatement;
use PHPUnit\Framework\TestCase;
use Ramsey\Uuid\Uuid;

class GroupRepositoryTest extends TestCase
{
    private PDO $pdo;
    private PDOStatement $stmt;
    private GroupRepository $repository;

    protected function setUp(): void
    {
        // Mock PDO and PDOStatement objects
        $this->pdo = $this->createMock(PDO::class);
        $this->stmt = $this->createMock(PDOStatement::class);
        $this->pdo->method('prepare')->willReturn($this->stmt);

        // Instantiate the repository with the mocked PDO
        $this->repository = new GroupRepository($this->pdo);
    }

    public function testCreateGroup()
    {
        $this->stmt->expects($this->exactly(4))
            ->method('bindParam')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $groupId = $this->repository->createGroup('Group Name', '123', '1');
        $this->assertNotNull($groupId);
        $this->assertTrue(Uuid::isValid($groupId));
    }

    public function testFindAllGroupsByUserId()
    {
        $this->stmt->expects($this->once())
            ->method('bindParam')
            ->with($this->equalTo(':user_id'), $this->equalTo('1'), $this->equalTo(PDO::PARAM_INT));

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('fetchAll')
            ->willReturn([
                ['group_id' => 1, 'group_name' => 'Group 1', 'group_index' => 1, 'model_id' => null, 'model_name' => null, 'model_index' => null, 'miniature_index' => null, 'miniature_amount' => null],
                ['group_id' => 2, 'group_name' => 'Group 2', 'group_index' => 2, 'model_id' => 3, 'model_name' => 'Model 1', 'model_index' => 1, 'miniature_index' => 1, 'miniature_amount' => 5],
            ]);

        $result = $this->repository->findAllGroupsByUserId('1');
        $this->assertCount(2, $result);
        $this->assertEquals('Group 1', $result[0]['group_name']);
    }

    public function testUpdateGroup()
    {
        $this->stmt->expects($this->exactly(3))
            ->method('bindParam')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('rowCount')
            ->willReturn(1);

        $result = $this->repository->updateGroup('456', 'New Name', '1');
        $this->assertEquals(1, $result);
    }

    public function testDeleteGroup()
    {
        $this->stmt->expects($this->exactly(2))
            ->method('bindParam')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $result = $this->repository->deleteGroup('456', '1');
        $this->assertTrue($result);
    }

    public function testReorderModelsInGroup()
    {
        $models = [
            ['id' => '1', 'index' => 1],
            ['id' => '2', 'index' => 2]
        ];

        $this->pdo->expects($this->once())
            ->method('beginTransaction');

        $this->stmt->expects($this->exactly(8))
            ->method('bindParam')
            ->willReturn(true);

        $this->stmt->expects($this->exactly(2))
            ->method('execute')
            ->willReturn(true);

        $this->pdo->expects($this->once())
            ->method('commit')
            ->willReturn(true);

        $result = $this->repository->reorderModelsInGroup('123', $models, '1');
        $this->assertTrue($result);
    }

    public function testReorderModelsInGroupWithRollback()
    {
        $models = [
            ['id' => '1', 'index' => 1],
            ['id' => '2', 'index' => 2]
        ];

        $this->pdo->expects($this->once())
            ->method('beginTransaction');

        $this->stmt->expects($this->exactly(2))
            ->method('execute')
            ->willReturnOnConsecutiveCalls(true, false);

        $this->pdo->expects($this->once())
            ->method('rollBack');

        $result = $this->repository->reorderModelsInGroup('123', $models, '1');
        $this->assertFalse($result);
    }
}
