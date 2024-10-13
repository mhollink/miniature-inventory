<?php
namespace App\services\group;

use App\services\InteractionRepository;
use PDO;
use Ramsey\Uuid\Uuid;

class GroupRepository extends InteractionRepository
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo);
        $this->pdo = $pdo;
    }

    /**
     * @param string $name
     * @param string $collectionId
     * @param string $userId
     * @return string|null
     */
    public function createGroup(string $name, string $collectionId, string $userId): string|null
    {
        $sql = "
            INSERT INTO groups (user_id, collection_id, group_id, name) 
            VALUES (:user_id, :collection_id, :group_id, :name)
        ";

        $groupId = Uuid::uuid4()->toString();

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':collection_id', $collectionId);
        $stmt->bindParam(':group_id', $groupId);
        $stmt->bindParam(':name', $name);

        return $stmt->execute() ? $groupId : null;
    }

    /**
     * @param string $userId
     * @return array
     */
    public function findAllGroupsByUserId(string $userId): array
    {
        $sql = "
            SELECT 
                g.group_id AS group_id,
                g.name AS group_name,
                g.sort_index AS group_index,
                m.model_id AS model_id,
                m.name AS model_name,
                m.sort_index AS model_index,
                mi.stage_index AS miniature_index,
                mi.amount AS miniature_amount
            FROM groups g
            LEFT JOIN models m ON g.group_id = m.group_id
            LEFT JOIN miniatures mi ON m.model_id = mi.model_id
            WHERE g.user_id = :user_id;
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /**
     * @param string $groupId
     * @param string $newName
     * @param string $userId
     * @return bool
     */
    public function updateGroup(string $groupId, string $newName, string $userId): int | null
    {
        $sql = "
            UPDATE groups g
            SET name = :name
            WHERE g.user_id = :user_id 
              AND g.group_id = :group_id;
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':group_id', $groupId);
        $stmt->bindParam(':name', $newName);

        return $stmt->execute() ? $stmt->rowCount() : null;
    }

    /**
     * @param string $groupId
     * @param string $userId
     * @return bool
     */
    public function deleteGroup(string $groupId, string $userId): bool {
        $sql = "
            DELETE FROM groups
            WHERE groups.user_id = :user_id 
              AND groups.group_id = :group_id;
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':group_id', $groupId);

        return $stmt->execute();
    }

    public function reorderModelsInGroup(string $groupId, array $models, string $userId): bool
    {
        $this->pdo->beginTransaction();

        foreach ($models as $model) {
            $id = $model['id'];
            $index = $model['index'];
            $sql = "
            UPDATE models 
            SET sort_index = :sort_index 
            WHERE model_id = :model_id AND group_id = :group_id AND user_id = :user_id;
        ";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':sort_index', $index);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':group_id', $groupId);
            $stmt->bindParam(':model_id', $id);
            $stmt->execute();
        }

        if ($this->pdo->commit()) {
            return true;
        } else {
            $this->pdo->rollBack();
            return false;
        }
    }
}