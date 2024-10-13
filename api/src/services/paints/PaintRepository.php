<?php

namespace App\services\paints;

use App\services\InteractionRepository;
use PDO;
use PDOException;
use Ramsey\Uuid\Uuid;

class PaintRepository extends InteractionRepository
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo);
        $this->pdo = $pdo;
    }

    /**
     * @param mixed $data
     * @param string $userId
     * @return string|null
     * @throws PaintAlreadyInStorageException
     */
    public function createPaint(mixed $data, string $userId): string|null
    {
        $paintId = Uuid::uuid4()->toString();
        $brand = $data['brand'];
        $range = $data['range'];
        $name = $data['name'];
        $color = $data['color'];

        $sql = "
            INSERT INTO `paints` (`user_id`, `paint_id`, `paint_brand`, `paint_range`, `paint_name`, `paint_color_code`) 
            VALUES (:user_id, :id, :brand, :range, :name, :color)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':id', $paintId);
        $stmt->bindParam(':brand', $brand);
        $stmt->bindParam(':range', $range);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':color', $color);

        try {
            return $stmt->execute() ? $paintId : null;
        } catch (PDOException $e) {
            if ($e->errorInfo[1] == 1062) {
                throw new PaintAlreadyInStorageException("Paint {$name} from {$brand} is already in your collection");
            } else {
                throw $e;
            }
        }
    }

    public function getAllPaintsForUser(string $userId): array
    {
        $sql = "
            SELECT paint_id as id, paint_brand as brand, paint_range as `range`, paint_name as name, paint_color_code as color
            FROM `paints`
            WHERE user_id = :user_id
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deletePaints(array $paintIds, string $userId): bool
    {
        $inQuery = str_repeat('?,', count($paintIds) - 1) . '?'; // gets ?,?,?,?,?,?

        $sql = "
            DELETE FROM `paints` WHERE user_id = ? AND `paint_id` in ($inQuery) 
        ";

        $stmt = $this->pdo->prepare($sql);
        $params = array_merge([$userId], $paintIds);

        return $stmt->execute($params);
    }
}