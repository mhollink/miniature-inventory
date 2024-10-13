<?php

namespace Tests\services;

use App\services\InteractionRepository;
use PHPUnit\Framework\TestCase;
use PDO;
use PDOStatement;

class InteractionRepositoryTest extends TestCase
{
    private PDO $pdo;
    private PDOStatement $stmt;
    private InteractionRepository $repository;

    protected function setUp(): void
    {
        // Mock PDO and PDOStatement objects
        $this->pdo = $this->createMock(PDO::class);
        $this->stmt = $this->createMock(PDOStatement::class);
        $this->pdo->method('prepare')->willReturn($this->stmt);

        // Instantiate the repository with the mocked PDO
        $this->repository = new InteractionRepository($this->pdo);
    }

    public function testUpsertLastInteractions()
    {
        // Expectations for the PDO statement
        $this->stmt->expects($this->exactly(3))
            ->method('bindParam')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        // Execute the method
        $this->repository->upsertLastInteractions('1', 'login');
    }
}
