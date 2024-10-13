<?php

namespace Tests\services\group;

use App\services\group\GroupMapper;
use PHPUnit\Framework\TestCase;

class GroupMapperTest extends TestCase
{
    private GroupMapper $mapper;

    protected function setUp(): void
    {
        $this->mapper = new GroupMapper();
    }

    public function testMapResultToGroupsWithModelsAndMiniatures()
    {
        $results = [
            [
                'group_id' => 1,
                'group_name' => 'Group 1',
                'group_index' => 1,
                'model_id' => 1,
                'model_name' => 'Model 1',
                'model_index' => 1,
                'miniature_index' => 1,
                'miniature_amount' => 5
            ],
            [
                'group_id' => 1,
                'group_name' => 'Group 1',
                'group_index' => 1,
                'model_id' => 1,
                'model_name' => 'Model 1',
                'model_index' => 1,
                'miniature_index' => 2,
                'miniature_amount' => 3
            ],
            [
                'group_id' => 1,
                'group_name' => 'Group 1',
                'group_index' => 1,
                'model_id' => 2,
                'model_name' => 'Model 2',
                'model_index' => 2,
                'miniature_index' => null,
                'miniature_amount' => null
            ],
            [
                'group_id' => 2,
                'group_name' => 'Group 2',
                'group_index' => 2,
                'model_id' => null,
                'model_name' => null,
                'model_index' => null,
                'miniature_index' => null,
                'miniature_amount' => null
            ],
        ];

        $expected = [
            [
                'id' => 1,
                'name' => 'Group 1',
                'sorting' => 1,
                'models' => [
                    [
                        'id' => 1,
                        'name' => 'Model 1',
                        'sorting' => 1,
                        'miniatures' => [
                            ['index' => 1, 'amount' => 5],
                            ['index' => 2, 'amount' => 3],
                        ]
                    ],
                    [
                        'id' => 2,
                        'name' => 'Model 2',
                        'sorting' => 2,
                        'miniatures' => []
                    ]
                ]
            ],
            [
                'id' => 2,
                'name' => 'Group 2',
                'sorting' => 2,
                'models' => []
            ]
        ];

        $result = $this->mapper->mapResultToGroupsWithModelsAndMiniatures($results);
        $this->assertEquals($expected, $result);
    }

    public function testMapResultToGroupsWithEmptyInput()
    {
        $results = [];

        $expected = [];

        $result = $this->mapper->mapResultToGroupsWithModelsAndMiniatures($results);
        $this->assertEquals($expected, $result);
    }

    public function testMapResultToGroupsWithNoModels()
    {
        $results = [
            [
                'group_id' => 1,
                'group_name' => 'Group 1',
                'group_index' => 1,
                'model_id' => null,
                'model_name' => null,
                'model_index' => null,
                'miniature_index' => null,
                'miniature_amount' => null
            ]
        ];

        $expected = [
            [
                'id' => 1,
                'name' => 'Group 1',
                'sorting' => 1,
                'models' => []
            ]
        ];

        $result = $this->mapper->mapResultToGroupsWithModelsAndMiniatures($results);
        $this->assertEquals($expected, $result);
    }
}
