<?php

namespace App\services;

use Slim\Psr7\Response as SlimResponse;

class BaseService
{

    protected function errorResponse(string $message, int $status = 500): SlimResponse
    {
        return $this->response(["error" => $message], $status);
    }

    protected function response(mixed $payload, int $status = 200): SlimResponse
    {
        $response = new SlimResponse();
        if (!is_null($payload)) {
            $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
        }
        return $response->withStatus($status);
    }
}