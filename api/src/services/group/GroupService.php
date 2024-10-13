<?php
namespace App\services\group;

use App\services\BaseService;
use App\services\user\SupportValidations;
use Slim\Psr7\Response as SlimResponse;

class GroupService extends BaseService
{
    private GroupValidations $groupValidations;
    private GroupMapper $groupMapper;
    private GroupRepository $groupRepository;
    private SupportValidations $supportValidations;

    public function __construct(
        GroupRepository  $repository,
        GroupMapper      $mapper,
        GroupValidations $validations,
        SupportValidations    $support
    )
    {
        $this->groupRepository = $repository;
        $this->groupValidations = $validations;
        $this->groupMapper = $mapper;
        $this->supportValidations = $support;
    }

    public function createGroup(string $collectionId, mixed $payload, string $userId): SlimResponse
    {
        // validate if the user can in fact create a new collection (or if its capped at the max)
        $response = $this->supportValidations->validateCanCreateGroup($userId);
        if (!is_null($response)) return $response;

        // validate if the payload has a 'name' field with a value.
        $response = $this->groupValidations->validateNameIsSet($payload);
        if (!is_null($response)) return $response;

        $name = $payload['name'];
        $groupId = $this->groupRepository->createGroup($name, $collectionId, $userId);

        if (is_null($groupId)) {
            return $this->errorResponse('Failed to create Group');
        }

        $this->groupRepository->upsertLastInteractions($userId, "Create Group");

        return $this->response(['id' => $groupId, 'name' => $name], 201);
    }

    public function findAllGroupsForUser(string $userId): SlimResponse
    {
        $rawDatabaseRows = $this->groupRepository->findAllGroupsByUserId($userId);
        $groups = $this->groupMapper->mapResultToGroupsWithModelsAndMiniatures($rawDatabaseRows);

        return $this->response($groups);
    }

    public function updateGroup(string $groupId, mixed $payload, string $userId): SlimResponse
    {
        // validate if the payload has a 'name' field with a value.
        $response = $this->groupValidations->validateNameIsSet($payload);
        if (!is_null($response)) return $response;

        $name = $payload['name'];
        $updatedRows = $this->groupRepository->updateGroup($groupId, $name, $userId);

        if (is_null($updatedRows)) {
            return $this->errorResponse('Failed to update Group');
        }
        if ($updatedRows == 0) {
            return $this->errorResponse('Nothing has been updated', 200);
        }

        // update the user actions table with the performed action
        $this->groupRepository->upsertLastInteractions($userId, "Update Group");

        return $this->response(['id' => $groupId, 'name' => $name]);
    }

    public function deleteGroup(string $groupId, string $userId): SlimResponse
    {
        $success = $this->groupRepository->deleteGroup($groupId, $userId);

        if (!$success) {
            return $this->errorResponse('Failed to delete Group');
        }

        $this->groupRepository->upsertLastInteractions($userId, "Delete Group");

        return $this->response(null, 204);
    }

    public function reorderModels(string $groupId, mixed $payload, string $userId): SlimResponse
    {
        $response = $this->groupValidations->validateSortingParams($payload);
        if (!is_null($response)) return $response;

        $success = $this->groupRepository->reorderModelsInGroup($groupId, $payload["models"], $userId);
        if (!$success) {
            return $this->errorResponse('Failed to update ordering of models');
        }

        $this->groupRepository->upsertLastInteractions($userId, "Update Group");

        return $this->response(null, 204);
    }
}