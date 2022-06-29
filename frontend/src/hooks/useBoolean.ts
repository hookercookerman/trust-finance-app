import { useCallback, useState } from "react";

export default function useBoolean(initialState = false) {
  const [state, setState] = useState(initialState);

  const on = useCallback(() => setState(true), [setState]);
  const off = useCallback(() => setState(false), [setState]);
  const toggle = useCallback(() => setState(!state), [setState, state]);

  return [ state, { on, off, toggle } ] as const;
}