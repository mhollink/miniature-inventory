<?php

use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use Kreait\Firebase\Exception\Auth\RevokedIdToken;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

global $app, $firebase;

$customErrorHandler = function (Request $request, Throwable $exception, bool $displayErrorDetails, bool $logErrors, bool $logErrorDetails) use ($app) {
    $payload = ['message' => $exception->getMessage()];
    if ($displayErrorDetails) {
        $payload = ['message' => $exception->getMessage(), 'details' => $exception->getTrace()];
    }

    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(500); // Change to appropriate status if needed
};

// Middleware for token validation
$tokenMiddleware = function (Request $request, RequestHandler $handler) use ($firebase) {
    $response = new SlimResponse();

    // Get token from Authorization header
    $authHeader = $request->getHeader('Authorization');
    if (!$authHeader || !isset($authHeader[0])) {
        $response->getBody()->write(json_encode(['error' => 'Authorization header missing']));
        return $response->withStatus(401);
    }

    try {
        // Verify the Firebase token and add the
        $idToken = str_replace('Bearer ', '', $authHeader[0]);
        $verifiedIdToken = $firebase->verifyIdToken($idToken);
        $request = $request->withAttribute('firebaseUser', $verifiedIdToken->claims()->get('sub'));
        $request = $request->withAttribute('verified', $verifiedIdToken->claims()->get('email_verified'));
        return $handler->handle($request);
    } catch (FailedToVerifyToken|RevokedIdToken $e) {
        $response->getBody()->write(json_encode(['message' => 'Invalid token']));
        return $response->withStatus(401);
    }
};

// Create middleware to set Content-Type
$addHeadersMiddleware = function ($request, $handler) {
    $response = $handler->handle($request);
    $response = $response->withHeader('Content-Type', 'application/json')
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS requests
    if ($request->getMethod() === 'OPTIONS') {
        return $response->withStatus(200);
    }

    return $response;
};