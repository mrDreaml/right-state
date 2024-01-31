import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const identity = v => v;
const assocPath = (state, path, callbackOrValue) => {
  if (!path.length) {
    return typeof callbackOrValue === 'function' ? callbackOrValue(state) : callbackOrValue;
  }
  const key = path.pop();
  return {
    ...state,
    [key]: assocPath(state[key], path, callbackOrValue)
  };
};
const StateContext = /*#__PURE__*/createContext(null);
export const useWatchState = (selector = identity) => {
  const store = useContext(StateContext);
  const [state, setState] = useState(() => selector(store.getState()));
  useEffect(() => {
    const handler = () => {
      const newState = selector(store.getState());
      if (newState !== state) {
        setState(newState);
      }
    };
    store.subscribe(handler);
    return () => store.unsubscribe(handler);
  }, [store, state, selector]);
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
  }, [initialState]);
  return /*#__PURE__*/React.createElement(StateContext.Provider, {
    value: store
  }, children);
};