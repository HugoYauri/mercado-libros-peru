import { useEffect, useState } from "react";
import { services } from "../services/index.js";
export function useService(method, args = []) {
  const key = JSON.stringify(args);
  const [state, setState] = useState({ key: null, result: null, error: null });
  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => services[method](...JSON.parse(key)))
      .then((result) => {
        if (active) setState({ key, result, error: null });
      })
      .catch((error) => {
        if (active) setState({ key, result: null, error: error.message });
      });
    return () => {
      active = false;
    };
  }, [method, key]);
  return {
    loading: state.key !== key,
    result: state.key === key ? state.result : null,
    error: state.key === key ? state.error : null,
  };
}
