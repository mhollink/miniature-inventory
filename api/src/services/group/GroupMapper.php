<?php
namespace App\services\group;

class GroupMapper
{
    /**
     * @param array $results
     * @return array
     */
    function mapResultToGroupsWithModelsAndMiniatures(array $results): array
    {
        $responseData = [];
        foreach ($results as $row) {
            // Get the group_id for each row
            $groupId = $row['group_id'];

            // If this group is not yet added to the results array, add it
            if (!isset($responseData[$groupId])) {
                $responseData[$groupId] = [
                    'id' => $groupId,
                    'name' => $row['group_name'],
                    'sorting' => $row['group_index'],
                    'models' => []
                ];
            }

            // Check if model already exists under the current group, if not add it to the array
            $modelId = $row['model_id'];
            if (!isset($responseData[$groupId]['models'][$modelId])) {
                if (!is_null($modelId)) {
                    $responseData[$groupId]['models'][$modelId] = [
                        'id' => $modelId,
                        'name' => $row['model_name'],
                        'sorting' => $row['model_index'],
                        'miniatures' => []
                    ];
                }
            }

            // If the there is a model id, and the miniature_index is null, add it to the specific model
            if (!is_null($modelId) && !is_null($row['miniature_index'])) {
                // Add miniatures under the model
                $responseData[$groupId]['models'][$modelId]['miniatures'][] = [
                    'index' => $row['miniature_index'],
                    'amount' => $row['miniature_amount'] ?? 0
                ];
            }
        }

        // Convert associative 'models' array to indexed array
        foreach ($responseData as &$group) {
            $group['models'] = array_values($group['models']);
        }

        // Convert the result array back into a numerically indexed array
        return array_values($responseData);
    }
}