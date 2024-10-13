<?php

namespace Tests\services\user;

namespace App\services\user;

use PHPUnit\Framework\TestCase;
use PDO;
use PDOStatement;
use Slim\Psr7\Response as SlimResponse;
use Slim\Psr7\Factory\ResponseFactory;

class SupportValidationsTest extends TestCase
{
    private PDO $pdo;
    private PDOStatement $stmt;
    private SupportValidations $service;

    protected function setUp(): void
    {
        $this->pdo = $this->createMock(PDO::class);
        $this->stmt = $this->createMock(PDOStatement::class);
        $this->pdo->method('prepare')->willReturn($this->stmt);

        $this->service = new SupportValidations($this->pdo);
    }

    public function testGetSupporterLevelWithValidUser()
    {
        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('fetch')->willReturn(['level' => 'gold']);

        $level = $this->service->getSupporterLevel('1');
        $this->assertEquals('gold', $level);
    }

    public function testGetSupporterLevelWithInvalidUser()
    {
        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('fetch')->willReturn(false);

        $level = $this->service->getSupporterLevel('999');
        $this->assertEquals('none', $level);
    }

    public function testValidateCanCreateCollectionWithSupporter()
    {
        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('fetch')->willReturn(['level' => 'silver']);

        $response = $this->service->validateCanCreateCollection('1');
        $this->assertNull($response);
    }

    public function testValidateCanCreateCollectionWithoutSupporterAndUnderLimit()
    {
        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('fetch')
            ->willReturnOnConsecutiveCalls(['level' => 'none'], ['item_count' => 2]);

        $response = $this->service->validateCanCreateCollection('1');
        $this->assertNull($response);
    }

    public function testValidateCanCreateCollectionWithoutSupporterAndOverLimit()
    {
        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('fetch')
            ->willReturnOnConsecutiveCalls(['level' => 'none'], ['item_count' => 4]);

        $response = $this->service->validateCanCreateCollection('1');
        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(409, $response->getStatusCode());
    }

    public function testValidateCanCreateGroupWithSupporter()
    {
        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('fetch')->willReturn(['level' => 'gold']);

        $response = $this->service->validateCanCreateGroup('1');
        $this->assertNull($response);
    }

    public function testValidateCanCreateGroupWithoutSupporterAndUnderLimit()
    {
        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('fetch')
            ->willReturnOnConsecutiveCalls(['level' => 'none'], ['item_count' => 15]);

        $response = $this->service->validateCanCreateGroup('1');
        $this->assertNull($response);
    }

    public function testValidateCanCreateGroupWithoutSupporterAndOverLimit()
    {
        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('fetch')
            ->willReturnOnConsecutiveCalls(['level' => 'none'], ['item_count' => 25]);

        $response = $this->service->validateCanCreateGroup('1');
        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(409, $response->getStatusCode());
    }
}
