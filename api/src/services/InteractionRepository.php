<?php

namespace App\services;

use PDO;

class InteractionRepository
{
    private PDO $pdo;

    /**
     * @param $pdo
     */
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function upsertLastInteractions(string $userId, string $action): void {
        $sql = "
            INSERT INTO `last_interaction` (`user_id`, `action`, `action_time`) 
            VALUES (:user_id, :action, CURRENT_TIME())
            ON DUPLICATE KEY UPDATE `action` = :action_update, `action_time` = CURRENT_TIME();
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':action', $action, PDO::PARAM_INT);
        $stmt->bindParam(':action_update', $action, PDO::PARAM_INT);

        $stmt->execute();
    }
}