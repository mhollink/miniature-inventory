<?php
namespace App\services\collection;

use App\services\InteractionRepository;
use PDO;
use Ramsey\Uuid\UuidFactoryInterface;

/**
 * The CollectionRepository is the database interface for the collections table. This repository
 * allows doing simple CRUD operations on the `collections` database table. The repository extends
 * the {@link InteractionRepository} which allows upserting the `last_interaction` table from this
 * repository as well.
 *
 * @author mhollink
 */
class CollectionRepository extends InteractionRepository
{
    private PDO $pdo;
    private UuidFactoryInterface $uuidFactory;

    public function __construct(PDO $pdo, UuidFactoryInterface $uuidFactory)
    {
        parent::__construct($pdo);
        $this->pdo = $pdo;
        $this->uuidFactory = $uuidFactory;
    }

    /**
     * Find all the collections given a specific userId.
     *
     * @param string $userId
     * @return array the result rows from the performed select query.
     * Each row in the array has an a collection id & name + the id,
     * name and index of a group. This group data can be null.
     */
    public function findCollectionsByUserId(string $userId): array
    {
        $sql = "
            SELECT 
                c.collection_id,
                c.name AS collection_name,
                g.group_id,
                g.name AS group_name,         
                g.sort_index AS group_index
            FROM collections c
            LEFT JOIN groups g ON c.collection_id = g.collection_id
            WHERE 
                c.user_id = :user_id;
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a new collection with a name for the specified user. Returns the id of
     * the created collection.
     *
     * @param string $name the name of the collection that is being created
     * @param string $userId the user for whom the collection is being created
     * @return string|null the id of the created collection, or null if the
     * creation failed
     */
    public function createCollection(string $name, string $userId): string|null
    {
        $sql = "
            INSERT INTO collections (user_id, collection_id, name) 
            VALUES (:user_id, :collection_id, :name)
        ";

        $collectionId = $this->uuidFactory->uuid4()->toString();

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':collection_id', $collectionId);
        $stmt->bindParam(':name', $name);

        return $stmt->execute() ? $collectionId : null;
    }

    /**
     * @param string $collectionId
     * @param string $newName
     * @param string $userId
     * @return int|null returns the amount of updated rows
     */
    public function updateCollection(string $collectionId, string $newName, string $userId): int | null
    {
        $sql = "
            UPDATE collections c
            SET name = :name
            WHERE c.user_id = :user_id 
              AND c.collection_id = :collection_id;
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':collection_id', $collectionId);
        $stmt->bindParam(':name', $newName);

        return $stmt->execute() ? $stmt->rowCount() : null;
    }

    /**
     * @param string $collectionId
     * @param string $userId
     * @return bool
     */
    public function deleteCollection(string $collectionId, string $userId): bool
    {
        $sql = "
            DELETE FROM collections
            WHERE collections.user_id = :user_id 
              AND collections.collection_id = :collection_id;
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':collection_id', $collectionId);

        return $stmt->execute();
    }

    /**
     * @param array $groups
     * @param string $userId
     * @return bool
     */
    public function reorderGroupsInCollection(array $groups, string $userId): bool
    {
        $this->pdo->beginTransaction();
        foreach ($groups as $group) {
            $groupId = $group['groupId'];
            $collectionId = $group['collectionId'];
            $index = $group['index'];
            $sql = "
            UPDATE groups 
            SET collection_id = :collection_id, sort_index = :sort_index 
            WHERE group_id = :group_id and user_id = :user_id;
        ";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':collection_id', $collectionId);
            $stmt->bindParam(':sort_index', $index);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':group_id', $groupId);
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