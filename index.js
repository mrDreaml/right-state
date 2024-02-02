import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const identity = v => v;
const assocPath = (stateByPath, path, callbackOrValue, originalState = stateByPath) => {
  if (!path.length) {
    return typeof callbackOrValue === 'function' ? callbackOrValue(stateByPath, originalState) : callbackOrValue;
  }
  const key = path.shift();
  return {
    ...stateByPath,
    [key]: assocPath(stateByPath[key], path, callbackOrValue, originalState)
  };
};
const StateContext = /*#__PURE__*/createContext(null);
export const useWatchState = (selector = identity) => {
  const store = useContext(StateContext);
  const [state, setState] = useState(() => selector(store.getState()));
  useEffect(() => {
    const handler = () => {
      setState(selector(store.getState()));
    };
    store.subscribe(handler);
    return () => store.unsubscribe(handler);
  }, [store, selector]);
  return state;
};
export const useGetState = () => {
  const store = useContext(StateContext);
  return store.getState;
};
export const useSetState = () => {
  const {
    setState
  } = useContext(StateContext);
  return setState;
};
export const usePatchState = () => {
  const {
    setState,
    getState
  } = useContext(StateContext);
  return useCallback((keyOrPath, callbackOrValue) => {
    const state = getState();
    const path = Array.isArray(keyOrPath) ? keyOrPath : [keyOrPath];
    setState(assocPath(state, path, callbackOrValue));
  }, [setState, getState]);
};
export const StateProvider = ({
  initialState,
  children
}) => {
  const store = useMemo(() => {
    const store = {};
    let subscriptions = [];
    let state = initialState;
    store.subscribe = callback => {
      subscriptions.push(callback);
    };
    store.unsubscribe = callback => {
      subscriptions = subscriptions.filter(currentCallback => currentCallback !== callback);
    };
    store.getState = () => state;
    store.setState = callbackOrValue => {
      state = typeof callbackOrValue === 'function' ? callbackOrValue(state) : callbackOrValue;
      subscriptions.forEach(callback => callback());
    };
    return store;
  }, []);
  return /*#__PURE__*/React.createElement(StateContext.Provider, {
    value: store
  }, children);
};