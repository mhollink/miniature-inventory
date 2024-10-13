<?php

namespace Tests\services\collection;

use App\services\collection\CollectionRepository;
use PDO;
use PDOStatement;
use PHPUnit\Framework\MockObject\Exception;
use PHPUnit\Framework\TestCase;
use Ramsey\Uuid\UuidFactoryInterface;
use Ramsey\Uuid\UuidInterface;

class CollectionRepositoryTest extends TestCase
{
    private PDO $pdo;
    private PDOStatement $stmt;
    private UuidInterface $uuidMock;
    private CollectionRepository $repository;

    /**
     * @throws Exception
     */
    protected function setUp(): void
    {
        $this->pdo = $this->createMock(PDO::class);
        $this->stmt = $this->createMock(PDOStatement::class);
        $this->uuidMock = $this->createMock(UuidInterface::class);

        $uuidFactoryMock = $this->createMock(UuidFactoryInterface::class);
        $uuidFactoryMock->method('uuid4')->willReturn($this->uuidMock);

        $this->repository = new CollectionRepository($this->pdo, $uuidFactoryMock);
    }

    public function testFindCollectionsByUserId()
    {
        $userId = '123';
        $expectedResult = [
            [
                'collection_id' => '1',
                'collection_name' => 'Collection 1',
                'group_id' => '10',
                'group_name' => 'Group 1',
                'group_index' => 1,
            ],
        ];

        // Configure the statement mock
        $this->stmt->expects($this->once())
            ->method('bindParam')
            ->with(':user_id', $userId, PDO::PARAM_INT);

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('fetchAll')
            ->with(PDO::FETCH_ASSOC)
            ->willReturn($expectedResult);

        // Configure the PDO mock to return the statement mock
        $this->pdo->expects($this->once())
            ->method('prepare')
            ->with($this->stringContains('SELECT'))
            ->willReturn($this->stmt);

        $result = $this->repository->findCollectionsByUserId($userId);

        $this->assertEquals($expectedResult, $result);
    }

    public function testCreateCollection()
    {
        $userId = '123';
        $name = 'New Collection';
        $uuid = '550e8400-e29b-41d4-a716-446655440000';

        // Mock the Uuid generation
        $this->uuidMock->expects($this->once())
            ->method('toString')
            ->willReturn($uuid);

        $this->stmt->expects($this->exactly(3))
            ->method('bindParam')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->pdo->expects($this->once())
            ->method('prepare')
            ->with($this->stringContains('INSERT INTO'))
            ->willReturn($this->stmt);

        $result = $this->repository->createCollection($name, $userId);

        $this->assertEquals($uuid, $result);
    }

    public function testUpdateCollection()
    {
        $collectionId = '1';
        $newName = 'Updated Collection';
        $userId = '123';

        $this->stmt->expects($this->exactly(3))
            ->method('bindParam')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('rowCount')
            ->willReturn(1);

        $this->pdo->expects($this->once())
            ->method('prepare')
            ->with($this->stringContains('UPDATE'))
            ->willReturn($this->stmt);

        $result = $this->repository->updateCollection($collectionId, $newName, $userId);

        $this->assertEquals(1, $result);
    }

    public function testDeleteCollection()
    {
        $collectionId = '1';
        $userId = '123';

        $this->stmt->expects($this->exactly(2))
            ->method('bindParam')
            ->willReturn(true);

        $this->stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->pdo->expects($this->once())
            ->method('prepare')
            ->with($this->stringContains('DELETE FROM'))
            ->willReturn($this->stmt);

        $result = $this->repository->deleteCollection($collectionId, $userId);

        $this->assertTrue($result);
    }

    public function testReorderGroupsInCollection()
    {
        $groups = [
            [
                'groupId' => '1',
                'collectionId' => 'Collection 1',
                'index' => 1,
            ],
            [
                'groupId' => '2',
                'collectionId' => 'Collection 1',
                'index' => 3,
            ],
            [
                'groupId' => '3',
                'collectionId' => 'Collection 1',
                'index' => 2,
            ],
        ];
        $userId = '123';

        $this->stmt->expects($this->exactly(4 * sizeof($groups)))
            ->method('bindParam')
            ->willReturn(true);

        $this->stmt->expects($this->exactly(sizeof($groups)))
            ->method('execute')
            ->willReturn(true);

        $this->pdo->expects($this->exactly(sizeof($groups)))
            ->method('prepare')
            ->with($this->stringContains('UPDATE groups'))
            ->willReturn($this->stmt);

        $this->pdo->expects($this->once())
            ->method('beginTransaction')
            ->willReturn(true);

        $this->pdo->expects($this->once())
            ->method('commit')
            ->willReturn(true);

        $this->pdo->expects($this->never())
            ->method('rollBack');

        $result = $this->repository->reorderGroupsInCollection($groups, $userId);

        $this->assertTrue($result);
    }

    public function testReorderGroupsInCollectionRollsBackFailedTransaction()
    {
        $groups = [];
        $userId = '123';

        $this->pdo->expects($this->once())
            ->method('beginTransaction')
            ->willReturn(true);

        $this->pdo->expects($this->once())
            ->method('commit')
            ->willReturn(false);

        $this->pdo->expects($this->once())
            ->method('rollBack')
            ->willReturn(false);

        $result = $this->repository->reorderGroupsInCollection($groups, $userId);

        $this->assertFalse($result);
    }
}
