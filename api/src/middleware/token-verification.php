<?php

use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use Kreait\Firebase\Exception\Auth\RevokedIdToken;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

global $firebase;

function verifyFirebaseAuthenticationToken(
    string         $authHeader,
    FirebaseAuth   $firebase,
    Request        $request,
    RequestHandler $handler,
    SlimResponse   $response
): SlimResponse|Response
{
    try {
        // Verify the Firebase token and add the
        $idToken = str_replace('Bearer ', '', $authHeader);
        $verifiedIdToken = $firebase->verifyIdToken($idToken);
        $request = $request->withAttribute('firebaseUser', $verifiedIdToken->claims()->get('sub'));
        $request = $request->withAttribute('verified', $verifiedIdToken->claims()->get('email_verified'));
        return $handler->handle($request);
    } catch (FailedToVerifyToken|RevokedIdToken $e) {
        $response->getBody()->write(json_encode(['error' => 'Invalid token']));
        return $response->withStatus(401);
    }
}

$tokenMiddleware = function (Request $request, RequestHandler $handler) use ($firebase) {
    $response = new SlimResponse();

    // Get token from Authorization header
    $authHeader = $request->getHeader('Authorization');
    if (!$authHeader || !isset($authHeader[0])) {
        $response->getBody()->write(json_encode(['error' => 'Authorization header missing']));
        return $response->withStatus(401);
    }

    // Authenticate with a test-user if profile is development
    if ($_ENV['PROFILE'] == "development") {
        $request = $request->withAttribute('firebaseUser', "test-user");
        $request = $request->withAttribute('verified', true);
        return $handler->handle($request);
    };

    // Otherwise validate token with Firebase and continue from there
    return verifyFirebaseAuthenticationToken($authHeader[0], $firebase, $request, $handler, $response);
};