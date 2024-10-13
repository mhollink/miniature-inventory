<?php

namespace App\services\workflow;

use App\services\BaseService;
use Slim\Psr7\Response as SlimResponse;

class WorkflowService extends BaseService
{
    private WorkflowRepository $workflowRepository;

    public function __construct(WorkflowRepository $workflowRepository)
    {
        $this->workflowRepository = $workflowRepository;
    }

    public function getWorkflow(string $userId): SlimResponse
    {
        $workflow = $this->workflowRepository->getWorkflowForUser($userId);

        if (empty($workflow)) {
            $workflow = [
                ["index" => "0", "name" => "Not started"],
                ["index" => "1", "name" => "Primed"],
                ["index" => "2", "name" => "Painted"],
                ["index" => "3", "name" => "Based"],
                ["index" => "4", "name" => "Finished"]
            ];
        }

        return $this->response($workflow);
    }

    public function setWorkflow(mixed $payload, string $userId): SlimResponse
    {
        $success = $this->workflowRepository->updateWorkflow($payload, $userId);

        if (!$success) {
            return $this->errorResponse("Failed to update workflow");
        }

        $this->workflowRepository->upsertLastInteractions($userId, "Update Workflow");

        $mappedStages = array_map(
            fn($value, $index) => [
                "index" => $index,
                "name" => $value
            ], $payload['stages'],
            array_keys($payload['stages'])
        );
        return $this->response($mappedStages);

    }

}