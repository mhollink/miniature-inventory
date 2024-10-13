<?php

namespace App\services\paints;

use App\services\BaseService;
use Slim\Psr7\Response as SlimResponse;

class PaintValidations extends BaseService
{
    public function validateContainsPaintFields(mixed $data): SlimResponse|null
    {
        if (!isset($data['brand']) || !isset($data['range']) || !isset($data['name'])) {
            return $this->errorResponse('Brand, Range, Name fields are required', 400);
        }

        return null;
    }

    public function validateHasIdsArray(mixed $data): SlimResponse|null
    {
        if (!isset($data['ids'])) {
            return $this->errorResponse('Ids field is required', 400);

        }

        if (!is_array($data['ids'])) {
            return $this->errorResponse('Ids must be an array', 400);
        }

        return null;
    }
}