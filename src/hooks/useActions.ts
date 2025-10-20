import { useState, useEffect } from "react";
import { getDataForPage} from "../services/getDataForPage";
import { Action } from "../types/Action";

export const useActions = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActions = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDataForPage();
      setActions(result.actions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  return { actions, loading, error, refetch: fetchActions };
};
