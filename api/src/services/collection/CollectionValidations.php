<?php
namespace App\services\collection;

use App\services\BaseService;
use Slim\Psr7\Response as SlimResponse;

class CollectionValidations extends BaseService
{

    public function validateNameIsSet(mixed $data): SlimResponse | null
    {
        if (!isset($data['name'])) {
            return $this->errorResponse("Name is required", 400);
        }

        return null;
    }

    public function validateSortingParams(mixed $data): SlimResponse | null
    {
        // Check if name is provided in the payload
        if (!isset($data['groups']) || !is_array($data["groups"])) {
            return $this->errorResponse("Groups field is required and must be an array", 400);
        }

        // Validate each group in the array has 'stage' and 'amount'
        foreach ($data['groups'] as $index => $group) {
            if (!isset($group['groupId']) || !isset($group['collectionId']) || !isset($group["index"])) {
                return $this->errorResponse("Each group must have an 'groupId', 'collectionId' and 'index' field", 400);
            }

            // You can also add more detailed validation here, e.g., checking if 'amount' is a number
            if (!is_numeric($group['index'])) {
                return $this->errorResponse("'index' must be a numeric value", 400);
            }
        }

        return null;
    }
}