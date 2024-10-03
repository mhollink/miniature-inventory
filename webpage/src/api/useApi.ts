import { useAuth } from "../firebase/FirebaseAuthContext.tsx";
import { getWorkflow } from "./workflow/get-workflow.ts";
import { setWorkflow } from "./workflow/set-workflow.ts";
import { getAllCollections } from "./collections/get-all-collections.ts";
import { getAllGroups } from "./groups/get-all-groups.ts";
import { createCollection } from "./collections/create-collection.ts";
import { createGroupInCollection } from "./groups/create-group.ts";
import { deleteCollection } from "./collections/delete-collection.ts";
import { updateCollection } from "./collections/update-collection.ts";
import { deleteGroup } from "./groups/delete-group.ts";
import { updateGroup } from "./groups/update-group.ts";
import { createModelInGroup } from "./models/create-model.ts";
import { deleteModel } from "./models/delete-model.ts";
import { updateModel } from "./models/update-model.ts";
import { getAccountInfo } from "./user/get-account-info.ts";
import { reorderGroups } from "./sorting/reorder-groups.ts";
import { reorderModels } from "./sorting/reorder-models.ts";
import { getStatistics } from "./statistics/get-statistics.ts";

export const apiUrl = import.meta.env.VITE_API_URL;

export const useApi = () => {
  const { idToken } = useAuth();

  return {
    getAccountInfo: getAccountInfo(idToken),
    fetchWorkflow: getWorkflow(idToken),
    updateWorkflow: setWorkflow(idToken),

    createCollection: createCollection(idToken),
    fetchCollections: getAllCollections(idToken),
    updateCollection: updateCollection(idToken),
    deleteCollection: deleteCollection(idToken),

    createGroup: createGroupInCollection(idToken),
    fetchGroups: getAllGroups(idToken),
    updateGroup: updateGroup(idToken),
    deleteGroup: deleteGroup(idToken),

    createModel: createModelInGroup(idToken),
    updateModel: updateModel(idToken),
    deleteModel: deleteModel(idToken),

    reorderGroups: reorderGroups(idToken),
    reorderModels: reorderModels(idToken),

    getStatistics: getStatistics(),
  };
};
