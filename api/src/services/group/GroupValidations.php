<?php
namespace App\services\group;

use App\services\BaseService;
use Slim\Psr7\Response as SlimResponse;


class GroupValidations extends BaseService
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
        if (!isset($data['models']) || !is_array($data["models"])) {
            return $this->errorResponse("Models field is required and must be an array", 400);
        }

        // Validate each model in the array has 'stage' and 'amount'
        foreach ($data['models'] as $index => $model) {
            if (!isset($model['id']) || !isset($model["index"])) {
                return $this->errorResponse("Each model must have an 'id' and 'index' field", 400);
            }

            // You can also add more detailed validation here, e.g., checking if 'amount' is a number
            if (!is_numeric($model['index'])) {
                return $this->errorResponse("'index' must be a numeric value", 400);
            }
        }

        return null;
    }
}