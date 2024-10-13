<?php

namespace App\services\user;

use App\services\BaseService;
use PDO;
use Slim\Psr7\Response as SlimResponse;

class SupportValidations extends BaseService
{
    private PDO $pdo;

    /**
     * @param $pdo
     */
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getSupporterLevel(string $userId)
    {
        $sql = "
            SELECT `level`
            FROM donators u
            WHERE u.user_id = :user_id;
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (isset($result) && is_array($result)) return $result['level'];
        else return 'none';
    }

    public function validateCanCreateCollection($userId): SlimResponse|null
    {
        $level = $this->getSupporterLevel($userId);
        if ($level != 'none') {
            return null;
        }

        $sql = "SELECT COUNT(*) AS item_count FROM `collections` WHERE user_id = :user_id";
        $itemCount = $this->getItemCountFromQuery($sql, $userId);

        if ($itemCount < 3) {
            return null;
        }

        return $this->errorResponse("Failed to create collection, support is required to create more than 3 collections", 409);
    }

    public function validateCanCreateGroup($userId): SlimResponse|null
    {
        $level = $this->getSupporterLevel($userId);
        if ($level != 'none') {
            return null;
        }

        $sql = "SELECT COUNT(*) AS item_count FROM `groups` WHERE user_id = :user_id";
        $itemCount = $this->getItemCountFromQuery($sql, $userId);

        if ($itemCount < 20) {
            return null;
        }

        return $this->errorResponse("Failed to create group, support is required to create more than 20 groups", 409);
    }

    /**
     * @param string $sql a query that should result in an `item_count` field.
     * @param string $userId the user_id that is checked, should als be part of the sql string
     * in the form of a placeholder `:user_id`
     * @return int the amount of items that are in the database.
     */
    private function getItemCountFromQuery(string $sql, string $userId): int
    {
        $stmtColCount = $this->pdo->prepare($sql);
        $stmtColCount->bindParam(':user_id', $userId);
        $stmtColCount->execute();
        $result = $stmtColCount->fetch();
        return $result['item_count'];
    }
}