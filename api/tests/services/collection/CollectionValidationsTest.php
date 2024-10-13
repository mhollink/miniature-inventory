<?php

namespace Tests\services\collection;

use App\services\collection\CollectionValidations;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Response as SlimResponse;

class CollectionValidationsTest extends TestCase
{
    private CollectionValidations $collectionValidations;

    protected function setUp(): void
    {
        $this->collectionValidations = new CollectionValidations();
    }

    public function testValidateNameIsSetReturnsNullWhenNameIsPresent()
    {
        $data = ['name' => 'Test Collection'];

        $response = $this->collectionValidations->validateNameIsSet($data);
        $this->assertNull($response);
    }

    public function testValidateNameIsSetReturnsResponseWhenNameIsNotPresent()
    {
        $data = [];

        $response = $this->collectionValidations->validateNameIsSet($data);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());

        $expectedBody = json_encode(['error' => 'Name is required'], JSON_UNESCAPED_UNICODE);
        $this->assertEquals($expectedBody, (string) $response->getBody());
    }

    public function testValidDataReturnsNull()
    {
        $validData = [
            'groups' => [
                ['groupId' => 1, 'collectionId' => 2, 'index' => 1],
                ['groupId' => 3, 'collectionId' => 4, 'index' => 2]
            ]
        ];

        $result = $this->collectionValidations->validateSortingParams($validData);
        $this->assertNull($result);
    }

    public function testMissingGroupsFieldReturns400()
    {
        $invalidData = [];

        $response = $this->collectionValidations->validateSortingParams($invalidData);
        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());

        $body = json_decode((string)$response->getBody(), true);
        $this->assertEquals('Groups field is required and must be an array', $body['error']);
    }

    public function testGroupsFieldNotArrayReturns400()
    {
        $invalidData = ['groups' => 'not_an_array'];

        $response = $this->collectionValidations->validateSortingParams($invalidData);
        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());

        $body = json_decode((string)$response->getBody(), true);
        $this->assertEquals('Groups field is required and must be an array', $body['error']);
    }

    public function testGroupMissingFieldsReturns400()
    {
        $invalidData = [
            'groups' => [
                ['collectionId' => 2, 'index' => 1]
            ]
        ];

        $response = $this->collectionValidations->validateSortingParams($invalidData);
        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());

        $body = json_decode((string)$response->getBody(), true);
        $this->assertEquals("Each group must have an 'groupId', 'collectionId' and 'index' field", $body['error']);
    }

    public function testIndexNotNumericReturns400()
    {
        $invalidData = [
            'groups' => [
                ['groupId' => 1, 'collectionId' => 2, 'index' => 'not_a_number']
            ]
        ];

        $response = $this->collectionValidations->validateSortingParams($invalidData);
        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());

        $body = json_decode((string)$response->getBody(), true);
        $this->assertEquals("'index' must be a numeric value", $body['error']);
    }

}
