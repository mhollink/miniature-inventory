<?php

namespace Tests\services\paints;

use PHPUnit\Framework\TestCase;
use App\services\paints\PaintValidations;
use Slim\Psr7\Response as SlimResponse;

class PaintValidationsTest extends TestCase
{
    private PaintValidations $validator;

    protected function setUp(): void
    {
        $this->validator = $this->getMockBuilder(PaintValidations::class)
            ->onlyMethods(['errorResponse'])
            ->getMock();
    }

    public function testValidateContainsPaintFieldsReturnsNullOnValidData(): void
    {
        $data = [
            'brand' => 'Brand A',
            'range' => 'Range 1',
            'name' => 'Paint X'
        ];

        $this->validator->expects($this->never())
            ->method('errorResponse');

        $result = $this->validator->validateContainsPaintFields($data);

        $this->assertNull($result);
    }

    public function testValidateContainsPaintFieldsReturnsErrorResponseOnMissingFields(): void
    {
        $data = [
            'brand' => 'Brand A',
            'range' => 'Range 1'
        ];

        $expectedResponse = new SlimResponse(400);

        $this->validator->expects($this->once())
            ->method('errorResponse')
            ->with('Brand, Range, Name fields are required', 400)
            ->willReturn($expectedResponse);

        $result = $this->validator->validateContainsPaintFields($data);

        $this->assertInstanceOf(SlimResponse::class, $result);
        $this->assertSame(400, $result->getStatusCode());
    }

    public function testValidateHasIdsArrayReturnsNullOnValidData(): void
    {
        $data = [
            'ids' => [1, 2, 3]
        ];

        $this->validator->expects($this->never())
            ->method('errorResponse');

        $result = $this->validator->validateHasIdsArray($data);

        $this->assertNull($result);
    }

    public function testValidateHasIdsArrayReturnsErrorResponseWhenIdsFieldIsMissing(): void
    {
        $data = [];

        $expectedResponse = new SlimResponse(400);

        $this->validator->expects($this->once())
            ->method('errorResponse')
            ->with('Ids field is required', 400)
            ->willReturn($expectedResponse);

        $result = $this->validator->validateHasIdsArray($data);

        $this->assertInstanceOf(SlimResponse::class, $result);
        $this->assertSame(400, $result->getStatusCode());
    }

    public function testValidateHasIdsArrayReturnsErrorResponseWhenIdsIsNotArray(): void
    {
        $data = [
            'ids' => 'not-an-array'
        ];

        $expectedResponse = new SlimResponse(400);

        $this->validator->expects($this->once())
            ->method('errorResponse')
            ->with('Ids must be an array', 400)
            ->willReturn($expectedResponse);

        $result = $this->validator->validateHasIdsArray($data);

        $this->assertInstanceOf(SlimResponse::class, $result);
        $this->assertSame(400, $result->getStatusCode());
    }
}

