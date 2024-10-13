<?php

namespace Tests\services\paints;

use App\services\paints\PaintAlreadyInStorageException;
use PHPUnit\Framework\TestCase;
use App\services\paints\PaintService;
use App\services\paints\PaintValidations;
use App\services\paints\PaintRepository;
use Slim\Psr7\Response as SlimResponse;

class PaintServiceTest extends TestCase
{
    private PaintService $paintService;
    private PaintValidations $paintValidations;
    private PaintRepository $paintRepository;

    protected function setUp(): void
    {
        $this->paintValidations = $this->createMock(PaintValidations::class);
        $this->paintRepository = $this->createMock(PaintRepository::class);

        $this->paintService = new PaintService($this->paintValidations, $this->paintRepository);
    }

    public function testCreatePaintReturnsErrorResponseOnValidationFailure(): void
    {
        $payload = ['range' => 'Range 1', 'name' => 'Paint X'];
        $userId = '123';
        $expectedResponse = new SlimResponse(400);

        $this->paintValidations->expects($this->once())
            ->method('validateContainsPaintFields')
            ->with($payload)
            ->willReturn($expectedResponse);

        $result = $this->paintService->createPaint($payload, $userId);

        $this->assertSame($expectedResponse, $result);
    }

    public function testCreatePaintReturnsErrorResponseOnRepositoryFailure(): void
    {
        $payload = ['brand' => 'Brand A', 'range' => 'Range 1', 'name' => 'Paint X'];
        $userId = '123';

        $this->paintValidations->expects($this->once())
            ->method('validateContainsPaintFields')
            ->with($payload)
            ->willReturn(null);

        $this->paintRepository->expects($this->once())
            ->method('createPaint')
            ->with($payload, $userId)
            ->willReturn(null);

        $expectedResponse = new SlimResponse(500);
        $this->paintService = $this->getMockBuilder(PaintService::class)
            ->setConstructorArgs([$this->paintValidations, $this->paintRepository])
            ->onlyMethods(['errorResponse'])
            ->getMock();

        $this->paintService->expects($this->once())
            ->method('errorResponse')
            ->with('Failed to create Paint')
            ->willReturn($expectedResponse);

        $result = $this->paintService->createPaint($payload, $userId);

        $this->assertSame($expectedResponse, $result);
    }

    public function testCreatePaintReturnsCreatedResponseOnSuccess(): void
    {
        $payload = ['brand' => 'Brand A', 'range' => 'Range 1', 'name' => 'Paint X'];
        $userId = '123';
        $paintId = '1';

        $this->paintValidations->expects($this->once())
            ->method('validateContainsPaintFields')
            ->with($payload)
            ->willReturn(null);

        $this->paintRepository->expects($this->once())
            ->method('createPaint')
            ->with($payload, $userId)
            ->willReturn($paintId);

        $this->paintRepository->expects($this->once())
            ->method('upsertLastInteractions')
            ->with($userId, "Create Paint");

        $response = $this->paintService->createPaint($payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertSame(201, $response->getStatusCode());
    }

    public function testCreatePaintReturnsConflictResponseOnException(): void
    {
        $payload = ['brand' => 'Brand A', 'range' => 'Range 1', 'name' => 'Paint X'];
        $userId = '123';

        $this->paintValidations->expects($this->once())
            ->method('validateContainsPaintFields')
            ->with($payload)
            ->willReturn(null);

        $this->paintRepository->expects($this->once())
            ->method('createPaint')
            ->with($payload, $userId)
            ->willThrowException(new PaintAlreadyInStorageException('Paint already exists'));

        $expectedResponse = new SlimResponse(409);
        $this->paintService = $this->getMockBuilder(PaintService::class)
            ->setConstructorArgs([$this->paintValidations, $this->paintRepository])
            ->onlyMethods(['errorResponse'])
            ->getMock();

        $this->paintService->expects($this->once())
            ->method('errorResponse')
            ->with('Paint already exists', 409)
            ->willReturn($expectedResponse);

        $result = $this->paintService->createPaint($payload, $userId);

        $this->assertSame($expectedResponse, $result);
    }

    public function testGetAllPaintsReturnsPaints(): void
    {
        $userId = '123';
        $paints = [
            ['id' => 1, 'brand' => 'Brand A', 'range' => 'Range 1', 'name' => 'Paint X'],
            ['id' => 2, 'brand' => 'Brand B', 'range' => 'Range 2', 'name' => 'Paint Y'],
        ];

        $this->paintRepository->expects($this->once())
            ->method('getAllPaintsForUser')
            ->with($userId)
            ->willReturn($paints);

        $response = $this->paintService->getAllPaints($userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertSame(200, $response->getStatusCode());
    }

    public function testDeletePaintsReturnsErrorResponseOnValidationFailure(): void
    {
        $payload = [];
        $userId = '123';
        $expectedResponse = new SlimResponse(400);

        $this->paintValidations->expects($this->once())
            ->method('validateHasIdsArray')
            ->with($payload)
            ->willReturn($expectedResponse);

        $result = $this->paintService->deletePaints($payload, $userId);

        $this->assertSame($expectedResponse, $result);
    }

    public function testDeletePaintsReturnsNoContentOnSuccess(): void
    {
        $payload = ['ids' => [1, 2, 3]];
        $userId = '123';

        $this->paintValidations->expects($this->once())
            ->method('validateHasIdsArray')
            ->with($payload)
            ->willReturn(null);

        $this->paintRepository->expects($this->once())
            ->method('deletePaints')
            ->with($payload['ids'], $userId)
            ->willReturn(true);

        $response = $this->paintService->deletePaints($payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertSame(204, $response->getStatusCode());
    }


    public function testDeletePaintsFails(): void
    {
        $payload = ['ids' => [1, 2, 3]];
        $userId = '123';

        $this->paintValidations->expects($this->once())
            ->method('validateHasIdsArray')
            ->with($payload)
            ->willReturn(null);

        $this->paintRepository->expects($this->once())
            ->method('deletePaints')
            ->with($payload['ids'], $userId)
            ->willReturn(false);

        $response = $this->paintService->deletePaints($payload, $userId);

        $this->assertInstanceOf(SlimResponse::class, $response);
        $this->assertSame(500, $response->getStatusCode());
    }
}
