<?php

namespace Tests\services\workflow;

use App\services\workflow\WorkflowRepository;
use App\services\workflow\WorkflowService;
use PHPUnit\Framework\TestCase;

class WorkflowServiceTest extends TestCase
{
    private WorkflowService $workflowService;
    private WorkflowRepository $repositoryMock;


    protected function setUp(): void
    {
        $this->repositoryMock = $this->createMock(WorkflowRepository::class);

        $this->workflowService = new WorkflowService(
            $this->repositoryMock,
        );
    }

    public function testGetWorkflowSuccessfully()
    {
        $userId = '123';
        $workflow = [
            ["index" => "0", "name" => "Phase 1"],
            ["index" => "1", "name" => "Phase 2"],
            ["index" => "2", "name" => "Phase 3"],
        ];

        $this->repositoryMock
            ->expects($this->once())
            ->method('getWorkflowForUser')
            ->with($userId)
            ->willReturn($workflow);

        $response = $this->workflowService->getWorkflow($userId);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($workflow, JSON_PRETTY_PRINT),
            (string)$response->getBody()
        );
    }

    public function testGetWorkflowReturnsDefaultWorkflow()
    {
        $userId = '123';
        $defaultWorkflow = [
            ["index" => "0", "name" => "Not started"],
            ["index" => "1", "name" => "Primed"],
            ["index" => "2", "name" => "Painted"],
            ["index" => "3", "name" => "Based"],
            ["index" => "4", "name" => "Finished"]
        ];

        $this->repositoryMock
            ->expects($this->once())
            ->method('getWorkflowForUser')
            ->with($userId)
            ->willReturn([]);

        $response = $this->workflowService->getWorkflow($userId);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($defaultWorkflow, JSON_PRETTY_PRINT),
            (string)$response->getBody()
        );
    }

    public function testSetWorkflowUpdatesAndReturnsWorkflow()
    {
        $userId = '123';
        $payload = [
            "stages" => [
                "Phase 1",
                "Phase 2",
                "Phase 3"
            ]
        ];
        $workflow = [
            ["index" => 0, "name" => "Phase 1"],
            ["index" => 1, "name" => "Phase 2"],
            ["index" => 2, "name" => "Phase 3"],
        ];

        $this->repositoryMock
            ->expects($this->once())
            ->method('updateWorkflow')
            ->with($payload, $userId)
            ->willReturn(true);

        $this->repositoryMock
            ->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, 'Update Workflow');

        $response = $this->workflowService->setWorkflow($payload, $userId);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($workflow, JSON_PRETTY_PRINT),
            (string)$response->getBody()
        );
    }

    public function testSetWorkflowUpdatesAndReturnsError()
    {
        $userId = '123';
        $payload = [
            "stages" => [
                "Phase 1",
                "Phase 2",
                "Phase 3"
            ]
        ];

        $this->repositoryMock
            ->expects($this->once())
            ->method('updateWorkflow')
            ->with($payload, $userId)
            ->willReturn(false);

        $response = $this->workflowService->setWorkflow($payload, $userId);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(["error" => "Failed to update workflow"], JSON_PRETTY_PRINT),
            (string)$response->getBody()
        );
    }
}
