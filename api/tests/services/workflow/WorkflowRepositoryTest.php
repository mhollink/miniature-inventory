<?php

namespace Tests\services\workflow;

use PHPUnit\Framework\TestCase;
use App\services\workflow\WorkflowRepository;
use PDO;
use PDOStatement;

class WorkflowRepositoryTest extends TestCase
{
    private PDO $pdo;
    private WorkflowRepository $repository;

    protected function setUp(): void
    {
        $this->pdo = $this->createMock(PDO::class);
        $this->repository = new WorkflowRepository($this->pdo);
    }

    public function testGetWorkflowForUserReturnsData(): void
    {
        $userId = '123';
        $expectedData = [
            ['index' => 0, 'name' => 'Stage 1'],
            ['index' => 1, 'name' => 'Stage 2']
        ];

        $stmt = $this->createMock(PDOStatement::class);

        $stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $stmt->expects($this->once())
            ->method('fetchAll')
            ->with(PDO::FETCH_ASSOC)
            ->willReturn($expectedData);

        $this->pdo->expects($this->once())
            ->method('prepare')
            ->with($this->stringContains('SELECT s.stage_index'))
            ->willReturn($stmt);

        $result = $this->repository->getWorkflowForUser($userId);

        $this->assertSame($expectedData, $result);
    }

    public function testUpdateWorkflowCommitsTransactionOnSuccess(): void
    {
        $userId = '123';
        $data = [
            'stages' => ['Stage 1', 'Stage 2', 'Stage 3']
        ];

        $this->pdo->expects($this->once())
            ->method('beginTransaction');

        $this->pdo->expects($this->once())
            ->method('commit')
            ->willReturn(true);

        $this->pdo->expects($this->never())
            ->method('rollBack');

        $this->pdo->expects($this->exactly(3))
            ->method('prepare')
            ->willReturn($this->createMock(PDOStatement::class));

        $result = $this->repository->updateWorkflow($data, $userId);

        $this->assertTrue($result);
    }

    public function testUpdateWorkflowRollsBackTransactionOnFailure(): void
    {
        $userId = '123';
        $data = [
            'stages' => ['Stage 1', 'Stage 2']
        ];

        $this->pdo->expects($this->once())
            ->method('beginTransaction');

        $this->pdo->expects($this->once())
            ->method('commit')
            ->willReturn(false);

        $this->pdo->expects($this->once())
            ->method('rollBack');

        $this->pdo->expects($this->exactly(3))
            ->method('prepare')
            ->willReturn($this->createMock(PDOStatement::class));

        $result = $this->repository->updateWorkflow($data, $userId);

        $this->assertFalse($result);
    }

    public function testUpdateWorkflowCallsDeleteExistingWorkflow(): void
    {
        $userId = '123';
        $data = [
            'stages' => ['Stage 1', 'Stage 2', 'Stage 3']
        ];

        $stmt = $this->createMock(PDOStatement::class);
        $stmt->expects($this->any())
            ->method('execute')
            ->willReturn(true);

        $this->pdo->expects($this->exactly(3))
            ->method('prepare')
            ->willReturn($stmt);

        $this->pdo->expects($this->once())
            ->method('commit')
            ->willReturn(true);

        $result = $this->repository->updateWorkflow($data, $userId);

        $this->assertTrue($result);
    }
}
