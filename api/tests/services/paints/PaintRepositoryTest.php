<?php

namespace Tests\services\paints;

use PDO;
use PDOStatement;
use PDOException;
use PHPUnit\Framework\TestCase;
use App\services\paints\PaintRepository;
use App\services\paints\PaintAlreadyInStorageException;

class PaintRepositoryTest extends TestCase
{
    private PaintRepository $paintRepository;
    private PDO $pdo;
    private PDOStatement $stmt;

    protected function setUp(): void
    {
        $this->pdo = $this->createMock(PDO::class);
        $this->stmt = $this->createMock(PDOStatement::class);

        $this->pdo->method('prepare')->willReturn($this->stmt);

        $this->paintRepository = new PaintRepository($this->pdo);
    }

    public function testCreatePaintReturnsPaintIdOnSuccess(): void
    {
        $data = ['brand' => 'Brand A', 'range' => 'Range 1', 'name' => 'Paint X', 'color' => '#FFFFFF'];
        $userId = '123';

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $paintId = $this->paintRepository->createPaint($data, $userId);

        $this->assertNotNull($paintId);
        $this->assertIsString($paintId);
    }

    public function testCreatePaintReturnsNullOnFailure(): void
    {
        $data = ['brand' => 'Brand A', 'range' => 'Range 1', 'name' => 'Paint X', 'color' => '#FFFFFF'];
        $userId = '123';

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(false);

        $paintId = $this->paintRepository->createPaint($data, $userId);

        $this->assertNull($paintId);
    }

    public function testCreatePaintThrowsExceptionOnDuplicateEntry(): void
    {
        $data = ['brand' => 'Brand A', 'range' => 'Range 1', 'name' => 'Paint X', 'color' => '#FFFFFF'];
        $userId = '123';

        $exception = new PDOException("Duplicate entry", 1062);
        $exception->errorInfo = ["1" => 1062];
        $this->stmt->expects($this->once())
            ->method('execute')
            ->willThrowException($exception);

        $this->expectException(PaintAlreadyInStorageException::class);
        $this->expectExceptionMessage("Paint Paint X from Brand A is already in your collection");

        $this->paintRepository->createPaint($data, $userId);
    }

    public function testCreatePaintRethrowsPDOExceptionOnUnknownErrorInfo(): void
    {
        $data = ['brand' => 'Brand A', 'range' => 'Range 1', 'name' => 'Paint X', 'color' => '#FFFFFF'];
        $userId = '123';

        $exception = new PDOException("PDO Error Message", 1);
        $this->stmt->expects($this->once())
            ->method('execute')
            ->willThrowException($exception);

        $this->expectException(PDOException::class);
        $this->expectExceptionMessage("PDO Error Message");

        $this->paintRepository->createPaint($data, $userId);
    }

    public function testGetAllPaintsForUserReturnsPaints(): void
    {
        $userId = '123';
        $expectedPaints = [
            ['id' => '1', 'brand' => 'Brand A', 'range' => 'Range 1', 'name' => 'Paint X', 'color' => '#FFFFFF'],
            ['id' => '2', 'brand' => 'Brand B', 'range' => 'Range 2', 'name' => 'Paint Y', 'color' => '#000000'],
        ];

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('fetchAll')
            ->with(PDO::FETCH_ASSOC)
            ->willReturn($expectedPaints);

        $paints = $this->paintRepository->getAllPaintsForUser($userId);

        $this->assertSame($expectedPaints, $paints);
    }

    public function testGetAllPaintsForUserReturnsEmptyArrayWhenNoPaintsFound(): void
    {
        $userId = '123';

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('fetchAll')
            ->with(PDO::FETCH_ASSOC)
            ->willReturn([]);

        $paints = $this->paintRepository->getAllPaintsForUser($userId);

        $this->assertEmpty($paints);
    }

    public function testDeletePaintsReturnsTrueOnSuccess(): void
    {
        $userId = '123';
        $paintIds = ['1', '2', '3'];

        $this->stmt->expects($this->once())
            ->method('execute')
            ->with(array_merge([$userId], $paintIds))
            ->willReturn(true);

        $result = $this->paintRepository->deletePaints($paintIds, $userId);

        $this->assertTrue($result);
    }

    public function testDeletePaintsReturnsFalseOnFailure(): void
    {
        $userId = '123';
        $paintIds = ['1', '2', '3'];

        $this->stmt->expects($this->once())
            ->method('execute')
            ->with(array_merge([$userId], $paintIds))
            ->willReturn(false);

        $result = $this->paintRepository->deletePaints($paintIds, $userId);

        $this->assertFalse($result);
    }
}
