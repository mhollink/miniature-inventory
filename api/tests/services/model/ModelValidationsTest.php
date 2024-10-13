<?php

namespace Tests\services\model;

use PHPUnit\Framework\TestCase;
use App\services\model\ModelValidations;
use Slim\Psr7\Response as SlimResponse;

class ModelValidationsTest extends TestCase
{
    private ModelValidations $modelValidations;

    protected function setUp(): void
    {
        // Set up the ModelValidations instance with the mocked BaseService
        $this->modelValidations = new ModelValidations();
    }

    public function testValidateRequestReturnsErrorResponseIfNameOrMiniaturesNotSet()
    {
        $data = ['miniatures' => []];

        $response = $this->modelValidations->validateRequest($data);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testValidateRequestReturnsErrorResponseIfMiniaturesIsNotArray()
    {
        $data = ['name' => 'Test Name', 'miniatures' => 'not-an-array'];

        $response = $this->modelValidations->validateRequest($data);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testValidateRequestReturnsErrorResponseIfMiniatureDoesNotHaveStageOrAmount()
    {
        $data = [
            'name' => 'Test Name',
            'miniatures' => [
                ['stage' => 1], // Missing 'amount'
            ]
        ];

        $response = $this->modelValidations->validateRequest($data);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testValidateRequestReturnsErrorResponseIfAmountOrStageIsNotNumeric()
    {
        $data = [
            'name' => 'Test Name',
            'miniatures' => [
                ['stage' => 'not-a-number', 'amount' => 10],
            ]
        ];

        $response = $this->modelValidations->validateRequest($data);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testValidateRequestReturnsNullForValidData()
    {
        $data = [
            'name' => 'Test Name',
            'miniatures' => [
                ['stage' => 1, 'amount' => 10],
                ['stage' => 2, 'amount' => 20],
            ]
        ];

        $response = $this->modelValidations->validateRequest($data);

        $this->assertNull($response);
    }
}
