<?php

namespace App\services\model;

use App\services\BaseService;
use Slim\Psr7\Response as SlimResponse;

class ModelValidations extends BaseService
{
    public function validateRequest(mixed $data): SlimResponse|null
    {
        if (!isset($data['name']) || !isset($data['miniatures'])) {
            return $this->errorResponse("Name and Miniatures fields are required", 400);
        }

        if (!is_array($data['miniatures'])) {
            return $this->errorResponse("Miniatures must be an array", 400);
        }

        // Validate each miniature in the array has 'stage' and 'amount'
        foreach ($data['miniatures'] as $index => $miniature) {
            if (!isset($miniature['stage']) || !isset($miniature['amount'])) {
                return $this->errorResponse("Each miniature must have 'stage' and 'amount' fields", 400);
            }

            if (!is_numeric($miniature['stage']) || !is_numeric($miniature['amount'])) {
                return $this->errorResponse("'amount' and 'stage' must be a numeric values", 400);
            }
        }

        return null;
    }
}