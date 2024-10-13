<?php

namespace App\services\workflow;

use App\services\InteractionRepository;
use PDO;

class WorkflowRepository extends InteractionRepository
{
    private PDO $pdo;

    /**
     * @param $pdo
     */
    public function __construct($pdo)
    {
        parent::__construct($pdo);
        $this->pdo = $pdo;
    }

    public function getWorkflowForUser(string $userId): array
    {
        $sql = "
            SELECT s.stage_index as `index`, name
            FROM workflow_stages s
            WHERE s.user_id = :user_id;
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateWorkflow(mixed $data, string $userId): bool
    {
        $this->pdo->beginTransaction();

        $this->deleteExistingWorkflow($userId);
        $this->insertNewWorkflow($data, $userId);
        $this->deleteMiniaturesOverflow(sizeof($data['stages']) - 1, $userId);

        if ($this->pdo->commit()) {
            return true;
        } else {
            $this->pdo->rollBack();
            return false;
        }
    }

    private function deleteExistingWorkflow($userId): void
    {
        $sql = "
            DELETE FROM workflow_stages
            WHERE workflow_stages.user_id = :user_id;
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
    }

    private function insertNewWorkflow(mixed $data, string $userId): void
    {
        $placeholders = [];
        $values = [];

        $sqlStages = "INSERT INTO workflow_stages (user_id, stage_index, name) VALUES ";
        foreach ($data['stages'] as $index => $stage) {
            $placeholders[] = "(:user_id{$index}, :stage_index{$index}, :name{$index})";
            $values["user_id{$index}"] = $userId;
            $values["stage_index{$index}"] = strval($index);
            $values["name{$index}"] = $stage;
        }
        $sqlStages .= implode(", ", $placeholders);
        $stmtStages = $this->pdo->prepare($sqlStages);

        $stmtStages->execute($values);
    }

    private function deleteMiniaturesOverflow(int $stageCap, string $userId): void
    {
        $sqlMiniatures = "
            DELETE FROM `miniatures` 
            WHERE `user_id` = :user_id AND `stage_index` > :stage_max
        ";
        $stmtMiniatures = $this->pdo->prepare($sqlMiniatures);
        $stmtMiniatures->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmtMiniatures->bindParam(':stage_max', $stageCap, PDO::PARAM_INT);

        $stmtMiniatures->execute();
    }
}