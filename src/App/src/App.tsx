import { useEffect } from 'react'
import { createStore } from '../../index'

type Count = number
interface PrevInfo {
    currentCount: number,
    prevCount: number
}

const Store = createStore({
    initialState: { count: 0, previnfo: { currentCount: 0, prevCount: 0 } 
    }
})

const { useSelector, patchState, getState } = Store

const Counter = () => {
    const count: Count = useSelector(state => state.count)
    const previnfo: PrevInfo = useSelector(state => state.previnfo)

    // Watcher
    useEffect(() => {
        console.log('Count has been updated: ', getState().count)
    }, [getState().count])

    return (
        <div style={{ padding: '1em' }}>
            <p>new: { previnfo.currentCount}, prev: { previnfo.prevCount }</p>
            <div style={{ display: 'flex', gap: '1em' }}>
                <button onClick={() => patchState('count', (count: Count) => count + 1)}>Increment</button>
                <button onClick={() => patchState('count', count - 1)}>Decrement</button>
                <button onClick={() => patchState('previnfo', (previnfo: PrevInfo) => ({ currentCount: count, prevCount: previnfo.currentCount}))}>Prev Info</button>
                <button onClick={() => patchState(['a', 'b', 'c'], (v: undefined | number) => !v ? 100 : v + 1)}>Nested</button>
                <button onClick={() => console.log(getState())}>Get State</button>
            </div>
            <h1>Count is: {count}</h1>
        </div>
    )
}

const App = () => {
    return (
        <Counter />
    )
}

export default App