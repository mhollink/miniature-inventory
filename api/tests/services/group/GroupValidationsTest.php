<?php

namespace Tests\services\group;

use PHPUnit\Framework\TestCase;
use App\services\group\GroupValidations;
use Slim\Psr7\Response as SlimResponse;

class GroupValidationsTest extends TestCase
{
    private GroupValidations $groupValidations;

    protected function setUp(): void
    {
        $this->groupValidations = new GroupValidations();
    }

    public function testValidateNameIsSetReturnsErrorResponseIfNameNotSet()
    {
        $data = [];

        $response = $this->groupValidations->validateNameIsSet($data);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testValidateNameIsSetReturnsNullIfNameIsSet()
    {
        $data = ['name' => 'Test Name'];

        $response = $this->groupValidations->validateNameIsSet($data);

        $this->assertNull($response);
    }

    public function testValidateSortingParamsReturnsErrorResponseIfModelsNotSet()
    {
        $data = [];

        $response = $this->groupValidations->validateSortingParams($data);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testValidateSortingParamsReturnsErrorResponseIfModelDoesNotHaveIdOrIndex()
    {
        $data = [
            'models' => [
                ['id' => 1], // Missing 'index'
            ]
        ];

        $response = $this->groupValidations->validateSortingParams($data);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testValidateSortingParamsReturnsErrorResponseIfIndexIsNotNumeric()
    {
        $data = [
            'models' => [
                ['id' => 1, 'index' => 'not-a-number'],
            ]
        ];

        $response = $this->groupValidations->validateSortingParams($data);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testValidateSortingParamsReturnsNullForValidData()
    {
        $data = [
            'models' => [
                ['id' => 1, 'index' => 1],
                ['id' => 2, 'index' => 2],
            ]
        ];

        $response = $this->groupValidations->validateSortingParams($data);

        $this->assertNull($response);
    }
}
