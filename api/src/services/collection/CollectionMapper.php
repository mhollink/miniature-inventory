<?php
namespace App\services\collection;

class CollectionMapper
{

    /**
     * @param array $result
     * @return array
     */
    function mapResultToCollectionsWithGroups(array $result): array
    {
        $responseData = [];
        foreach ($result as $row) {
            // Get the collection_id for each row
            $collectionId = $row['collection_id'];

            // If this collection is not yet added to the result array, add it
            if (!isset($responseData[$collectionId])) {
                $responseData[$collectionId] = [
                    'id' => $collectionId,
                    'name' => $row['collection_name'],
                    'groups' => []
                ];
            }

            // Add the group (if present on the row) to the collection
            // (can be null for empty collections)
            if (!is_null($row['group_id'])) {
                $responseData[$collectionId]['groups'][] = [
                    'id' => $row['group_id'],
                    'name' => $row['group_name'],
                    'sorting' => $row['group_index']
                ];
            }
        }

        // Convert the result array back into a numerically indexed array
        return array_values($responseData);
    }
}