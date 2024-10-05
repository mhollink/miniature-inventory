import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";
import { useStore } from "@state/store.ts";
import { Spinner } from "@components/spinner/Spinner.tsx";
import { ModalTypes } from "@components/modal/modals.tsx";
import { useReload } from "@hooks/useReload.ts";

export const InitialLoad: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const { loadAccountInfo, loadCollections, loadWorkflow } = useReload();
  const { clearInventory, openModal } = useStore();
  const [fetching, setFetching] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (loaded) return;

    if (!user) {
      clearInventory();
    } else {
      setFetching(true);
      Promise.all([
        loadWorkflow(),
        loadCollections(),
        loadAccountInfo(),
      ]).finally(() => {
        setFetching(false);
        setLoaded(true);
      });

      if (localStorage.getItem("my-mini-inventory")) {
        openModal(ModalTypes.OLD_VERSION_DATA);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  return <>{!fetching || loading ? children : <Spinner />}</>;
};
