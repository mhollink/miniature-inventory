<?php

namespace Tests\services\collection;

use PHPUnit\Framework\TestCase;
use App\services\collection\CollectionMapper;

class CollectionMapperTest extends TestCase
{
    private CollectionMapper $mapper;

    protected function setUp(): void
    {
        $this->mapper = new CollectionMapper();
    }

    public function testEmptyInputReturnsEmptyArray()
    {
        $result = [];
        $mappedResult = $this->mapper->mapResultToCollectionsWithGroups($result);
        $this->assertIsArray($mappedResult);
        $this->assertEmpty($mappedResult);
    }

    public function testSingleCollectionWithoutGroups()
    {
        $result = [
            ['collection_id' => 1, 'collection_name' => 'Collection 1', 'group_id' => null, 'group_name' => null, 'group_index' => null]
        ];
        $mappedResult = $this->mapper->mapResultToCollectionsWithGroups($result);

        $expected = [
            [
                'id' => 1,
                'name' => 'Collection 1',
                'groups' => []
            ]
        ];

        $this->assertIsArray($mappedResult);
        $this->assertCount(1, $mappedResult);
        $this->assertEquals($expected, $mappedResult);
    }

    public function testSingleCollectionWithMultipleGroups()
    {
        $result = [
            ['collection_id' => 1, 'collection_name' => 'Collection 1', 'group_id' => 1, 'group_name' => 'Group 1', 'group_index' => 1],
            ['collection_id' => 1, 'collection_name' => 'Collection 1', 'group_id' => 2, 'group_name' => 'Group 2', 'group_index' => 2]
        ];
        $mappedResult = $this->mapper->mapResultToCollectionsWithGroups($result);

        $expected = [
            [
                'id' => 1,
                'name' => 'Collection 1',
                'groups' => [
                    ['id' => 1, 'name' => 'Group 1', 'sorting' => 1],
                    ['id' => 2, 'name' => 'Group 2', 'sorting' => 2]
                ]
            ]
        ];

        $this->assertIsArray($mappedResult);
        $this->assertCount(1, $mappedResult);
        $this->assertEquals($expected, $mappedResult);
    }

    public function testMultipleCollectionsWithGroups()
    {
        $result = [
            ['collection_id' => 1, 'collection_name' => 'Collection 1', 'group_id' => 1, 'group_name' => 'Group 1', 'group_index' => 1],
            ['collection_id' => 2, 'collection_name' => 'Collection 2', 'group_id' => 3, 'group_name' => 'Group 3', 'group_index' => 1],
            ['collection_id' => 2, 'collection_name' => 'Collection 2', 'group_id' => 4, 'group_name' => 'Group 4', 'group_index' => 2]
        ];
        $mappedResult = $this->mapper->mapResultToCollectionsWithGroups($result);

        $expected = [
            [
                'id' => 1,
                'name' => 'Collection 1',
                'groups' => [
                    ['id' => 1, 'name' => 'Group 1', 'sorting' => 1]
                ]
            ],
            [
                'id' => 2,
                'name' => 'Collection 2',
                'groups' => [
                    ['id' => 3, 'name' => 'Group 3', 'sorting' => 1],
                    ['id' => 4, 'name' => 'Group 4', 'sorting' => 2]
                ]
            ]
        ];

        $this->assertIsArray($mappedResult);
        $this->assertCount(2, $mappedResult);
        $this->assertEquals($expected, $mappedResult);
    }
}
