<?php

namespace App\services\collection;

use App\services\BaseService;
use App\services\user\SupportValidations;
use Slim\Psr7\Response as SlimResponse;

class CollectionService extends BaseService
{
    private CollectionValidations $collectionValidations;
    private CollectionMapper $collectionMapper;
    private CollectionRepository $collectionRepository;
    private SupportValidations $supportValidations;

    public function __construct(
        CollectionRepository  $repository,
        CollectionMapper      $mapper,
        CollectionValidations $validations,
        SupportValidations    $support
    )
    {
        $this->collectionRepository = $repository;
        $this->collectionValidations = $validations;
        $this->collectionMapper = $mapper;
        $this->supportValidations = $support;
    }

    /**
     * @param mixed $payload - an object that should contain the name of the collection that is created
     * @param string $userId - the id of the user who is creating the collection
     * @return SlimResponse - the API response with data and status code.
     */
    public function createCollection(mixed $payload, string $userId): SlimResponse
    {
        // validate if the user can in fact create a new collection (or if its capped at the max)
        $response = $this->supportValidations->validateCanCreateCollection($userId);
        if (!is_null($response)) return $response;

        // validate if the payload has a 'name' field with a value.
        $response = $this->collectionValidations->validateNameIsSet($payload);
        if (!is_null($response)) return $response;

        $name = $payload['name'];
        $collectionId = $this->collectionRepository->createCollection($name, $userId);

        // if collectionId is null it means no collection was created and we should inform the user.
        if (is_null($collectionId)) {
            return $this->errorResponse('Failed to create collection');
        }

        // update the user actions table with the performed action
        $this->collectionRepository->upsertLastInteractions($userId, "Create Collection");

        // respond with the id/name of the created collection.
        return $this->response(['id' => $collectionId, 'name' => $name], 201);
    }

    /**
     * @param string $userId - the id of the user we are fetching the collections of.
     * @return SlimResponse - the API response with data and status code.
     */
    public function findAllCollectionsForUser(string $userId): SlimResponse
    {
        $rawDatabaseRows = $this->collectionRepository->findCollectionsByUserId($userId);
        $collections = $this->collectionMapper->mapResultToCollectionsWithGroups($rawDatabaseRows);

        return $this->response($collections);

    }

    /**
     * @param string $collectionId
     * @param mixed $payload
     * @param string $userId
     * @return SlimResponse
     */
    public function updateCollection(string $collectionId, mixed $payload, string $userId): SlimResponse
    {
        // validate if the payload has a 'name' field with a value.
        $response = $this->collectionValidations->validateNameIsSet($payload);
        if (!is_null($response)) return $response;

        $name = $payload['name'];
        $rowsUpdated = $this->collectionRepository->updateCollection($collectionId, $name, $userId);

        if (is_null($rowsUpdated)) {
            return $this->errorResponse('Failed to update collection');
        }
        if ($rowsUpdated == 0) {
            return $this->errorResponse('Nothing has been updated', 200);
        }

        // update the user actions table with the performed action
        $this->collectionRepository->upsertLastInteractions($userId, "Update Collection");
        return $this->response(['id' => $collectionId, 'name' => $name]);
    }

    /**
     * @param mixed $payload
     * @param string $userId
     * @return SlimResponse
     */
    public function reorderGroupsInCollections(mixed $payload, string $userId): SlimResponse
    {
        $response = $this->collectionValidations->validateSortingParams($payload);
        if (!is_null($response)) return $response;

        $success = $this->collectionRepository->reorderGroupsInCollection($payload["groups"], $userId);
        if (!$success) {
            return $this->errorResponse('Failed to update ordering of groups');
        }

        $this->collectionRepository->upsertLastInteractions($userId, "Update Collection");

        return $this->response(null, 204);
    }

    /**
     * @param string $collectionId
     * @param string $userId
     * @return SlimResponse
     */
    public function deleteCollection(string $collectionId, string $userId): SlimResponse
    {
        $success = $this->collectionRepository->deleteCollection($collectionId, $userId);

        if (!$success) {
            return $this->errorResponse('Failed to delete collection');
        }

        $this->collectionRepository->upsertLastInteractions($userId, "Delete Collection");

        return $this->response(null, 204);
    }
}