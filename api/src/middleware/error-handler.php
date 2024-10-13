<?php

use Psr\Http\Message\ServerRequestInterface as Request;

global $app;

function findBestStatusCode( Throwable $exception): int
{
   $status = 500;

   if ($exception->getMessage() == "Not found.") $status = 404;

   return $status;
}

$customErrorHandler = function (Request $request, Throwable $exception, bool $displayErrorDetails, bool $logErrors, bool $logErrorDetails) use ($app) {
    $payload = ['message' => $exception->getMessage()];
    if ($displayErrorDetails) {
        $payload = ['message' => $exception->getMessage(), 'details' => $exception->getTrace()];
    }

    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));

    $status = findBestStatusCode($exception);

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status); // Change to appropriate status if needed
};