<?php

namespace App\services\model;

use App\services\InteractionRepository;
use PDO;
use Ramsey\Uuid\Uuid;

class ModelRepository extends InteractionRepository
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo);
        $this->pdo = $pdo;
    }

    /**
     * @param string $groupId
     * @param mixed $data
     * @param string $userId
     * @return string|null
     */
    public function createModel(string $groupId, mixed $data, string $userId): string|null
    {
        $modelId = Uuid::uuid4()->toString();
        $name = $data['name'];

        $this->pdo->beginTransaction();

        // Insert the model in the database
        $sql = "
            INSERT INTO models (user_id, group_id, model_id, name)
            VALUES (:user_id, :group_id, :model_id, :name);
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':group_id', $groupId);
        $stmt->bindParam(':model_id', $modelId);
        $stmt->bindParam(':name', $name);
        $stmt->execute();

        // Generate an insert sql command for the miniatures;
        $sqlMiniatures = "INSERT INTO miniatures (user_id, model_id, stage_index, amount) VALUES ";
        $placeholders = [];
        $values = [];
        foreach ($data['miniatures'] as $index => $miniature) {
            $placeholders[] = "(:user_id{$index}, :model_id{$index}, :stage_index{$index}, :amount{$index})";

            // Bind values, using the new model ID
            $values["user_id{$index}"] = $userId;
            $values["model_id{$index}"] = $modelId;
            $values["stage_index{$index}"] = $miniature['stage'];
            $values["amount{$index}"] = $miniature['amount'];
        }
        // Complete the SQL query
        $sqlMiniatures .= implode(", ", $placeholders);

        // Prepare and execute the miniatures insertion query
        $stmtMiniatures = $this->pdo->prepare($sqlMiniatures);
        $stmtMiniatures->execute($values);

        if ($this->pdo->commit()) {
            return $modelId;
        } else {
            $this->pdo->rollBack();
            return null;
        }
    }

    public function updateModel(string $modelId, mixed $data, string $userId): int | null
    {
        $newName = $data['name'];

        $this->pdo->beginTransaction();

        $sql = "
            UPDATE models m
            SET name = :name
            WHERE m.user_id = :user_id 
              AND m.model_id = :model_id;
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':model_id', $modelId);
        $stmt->bindParam(':name', $newName);
        $stmt->execute();
        $rows = $stmt->rowCount();

        foreach ($data['miniatures'] as $miniature) {
            $sqlMiniatures = "
                INSERT INTO miniatures (user_id, model_id, stage_index, amount)
                VALUES (:user_id, :model_id, :stage_index, :amount)
                ON DUPLICATE KEY UPDATE amount = :amount_update;
            ";
            $stmtMiniatures = $this->pdo->prepare($sqlMiniatures);
            $stmtMiniatures->bindParam(':user_id', $userId);
            $stmtMiniatures->bindParam(':model_id', $modelId);
            $stmtMiniatures->bindParam(':stage_index', $miniature['stage']);
            $stmtMiniatures->bindParam(':amount', $miniature['amount']);
            $stmtMiniatures->bindParam(':amount_update', $miniature['amount']);
            $stmtMiniatures->execute();
            $rows += $stmtMiniatures->rowCount();
        }

        if ($this->pdo->commit()) {
            return $rows;
        } else {
            $this->pdo->rollBack();
            return null;
        }
    }

    public function deleteModel(string $modelId, string $userId): bool
    {
        $sql = "
            DELETE FROM models
            WHERE models.user_id = :user_id 
              AND models.model_id = :model_id;
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':model_id', $modelId);

        return $stmt->execute();
    }
}