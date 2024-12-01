import { useEffect, useState } from 'react'

const EMPTY_ARRAY: readonly any[] = []

const identity = <T>(v: T): T => v

type DefaultStateGetter = (stateByPath: any, originalState: Record<string, any>) => any

const assocPath = (
    stateByPath: Record<string, any>,
    path: string[],
    callbackOrValue: DefaultStateGetter | any,
    originalState: Record<string, any> = stateByPath
): any => {
    if (!path.length) {
        return typeof callbackOrValue === 'function' ? callbackOrValue(stateByPath, originalState) : callbackOrValue
    }
    const key = path.shift()!
    stateByPath ??= {}
    return { ...stateByPath, [key]: assocPath(stateByPath[key], path, callbackOrValue, originalState) }
}

interface State {
    [key: string]: any
}

interface StoreOptions {
    initialState: State
}

type Selector<T> = (state: State) => T

type UpdateStateHandler = (state: State) => void

export const createStore = ({ initialState }: StoreOptions) => {
    let state: State = initialState
    let subscriptions: Array<UpdateStateHandler> = []

    const getState = (): State => state

    const setState = (newState: State): void => {
        state = newState
        subscriptions.forEach((handler) => handler(state))
    }

    const patchState = (keyOrPath: string | string[], callbackOrValue: any) => {
        const state = getState()
        const path = Array.isArray(keyOrPath) ? keyOrPath : [keyOrPath]
        setState(assocPath(state, path, callbackOrValue))
    }

    const subscribe = (callback: UpdateStateHandler) => {
        subscriptions.push(callback)
    }
    const unsubscribe = (callback: UpdateStateHandler) => {
        subscriptions = subscriptions.filter(currentCallback => currentCallback !== callback)
    }

    const useSelector = (selector: Selector<State> = identity, deps = EMPTY_ARRAY): any => {
        const [localState, setLocalState] = useState(() => selector(getState()))
    
        useEffect(() => {
            setLocalState(selector(getState()))
            const handler = () => {
                setLocalState(selector(getState()))
            }
    
            subscribe(handler)
    
            return () => unsubscribe(handler)
        }, deps)
    
        return localState
    }

    return {
        getState,
        setState,
        patchState,
        useSelector,
    }
}
