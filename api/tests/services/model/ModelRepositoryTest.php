<?php

namespace Tests\services\model;

use PDOStatement;
use PHPUnit\Framework\TestCase;
use App\services\model\ModelRepository;
use PDO;

class ModelRepositoryTest extends TestCase
{
    private ModelRepository $modelRepository;
    private PDO $pdoMock;

    protected function setUp(): void
    {
        // Create a mock PDO instance
        $this->pdoMock = $this->createMock(PDO::class);
        $this->modelRepository = new ModelRepository($this->pdoMock);
    }

    public function testCreateModelReturnsModelIdOnSuccess()
    {
        $groupId = 'group-id';
        $userId = 'user-id';
        $data = [
            'name' => 'Test Model',
            'miniatures' => [
                ['stage' => 1, 'amount' => 10],
                ['stage' => 2, 'amount' => 20],
            ],
        ];

        // Expect the transaction methods to be called
        $this->pdoMock->expects($this->once())->method('beginTransaction');
        $this->pdoMock->expects($this->once())->method('commit')->willReturn(true);

        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->exactly(2))
            ->method('execute')
            ->willReturn(true);

        $this->pdoMock->expects($this->exactly(2))
            ->method('prepare')
            ->willReturn($stmtMock);

        $modelId = $this->modelRepository->createModel($groupId, $data, $userId);

        $this->assertNotNull($modelId);
    }

    public function testCreateModelReturnsNullOnFailure()
    {
        $groupId = 'group-id';
        $userId = 'user-id';
        $data = [
            'name' => 'Test Model',
            'miniatures' => [
                ['stage' => 1, 'amount' => 10],
            ],
        ];

        $this->pdoMock->expects($this->once())->method('beginTransaction');
        $this->pdoMock->expects($this->once())->method('rollBack');

        // Mock the first insert statement
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->exactly(2))
            ->method('execute')
            ->willReturn(false);

        $this->pdoMock->expects($this->exactly(2))
            ->method('prepare')
            ->willReturn($stmtMock);

        $modelId = $this->modelRepository->createModel($groupId, $data, $userId);

        $this->assertNull($modelId);
    }

    public function testUpdateModelReturnsUpdatedRowCountOnSuccess()
    {
        $modelId = 'model-id';
        $userId = 'user-id';
        $data = [
            'name' => 'Updated Model',
            'miniatures' => [
                ['stage' => 1, 'amount' => 15],
            ],
        ];

        $this->pdoMock->expects($this->once())->method('beginTransaction');
        $this->pdoMock->expects($this->once())->method('commit')->willReturn(true);

        // Mock the update statement
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->exactly(2))
            ->method('execute')
            ->willReturn(true);
        $stmtMock->expects($this->exactly(2))
            ->method('rowCount')
            ->willReturn(1);
        $this->pdoMock->expects($this->exactly(2))
            ->method('prepare')
            ->willReturn($stmtMock);


        $rows = $this->modelRepository->updateModel($modelId, $data, $userId);

        $this->assertEquals(2, $rows); // 1 for the model, 1 for the miniatures
    }

    public function testUpdateModelReturnsNullOnFailure()
    {
        $modelId = 'model-id';
        $userId = 'user-id';
        $data = [
            'name' => 'Updated Model',
            'miniatures' => [
                ['stage' => 1, 'amount' => 15],
            ],
        ];

        $this->pdoMock->expects($this->once())->method('beginTransaction');
        $this->pdoMock->expects($this->once())->method('rollBack');

        // Mock the update statement
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->exactly(2))
            ->method('execute')
            ->willReturn(false);

        $this->pdoMock->expects($this->exactly(2))
            ->method('prepare')
            ->willReturn($stmtMock);

        $rows = $this->modelRepository->updateModel($modelId, $data, $userId);

        $this->assertNull($rows);
    }

    public function testDeleteModelReturnsTrueOnSuccess()
    {
        $modelId = 'model-id';
        $userId = 'user-id';

        // Mock the delete statement
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->pdoMock->expects($this->once())
            ->method('prepare')
            ->willReturn($stmtMock);

        $success = $this->modelRepository->deleteModel($modelId, $userId);

        $this->assertTrue($success);
    }

    public function testDeleteModelReturnsFalseOnFailure()
    {
        $modelId = 'model-id';
        $userId = 'user-id';

        // Mock the delete statement
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())
            ->method('execute')
            ->willReturn(false);

        $this->pdoMock->expects($this->once())
            ->method('prepare')
            ->willReturn($stmtMock);

        $success = $this->modelRepository->deleteModel($modelId, $userId);

        $this->assertFalse($success);
    }
}
