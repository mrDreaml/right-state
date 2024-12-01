# right-store

<p>
Effortlessly manage state in your React applications with this lightweight library. Say goodbye to the complexities of middleware handling and reduces headaches. Use it to seamlessly bind components state to specific values from your data store, ensuring efficient rendering based on data changes. Simplify your React development experience and enhance performance by focusing on the essentials, leaving behind the middleware complexities and reducer intricacies.
</p>

### Counter Example:
```
import { useEffect } from 'react'
import { createStore } from 'right-store'

type Count = number

const Store = createStore({
    initialState: { count: 0 }
})

const { useSelector, patchState, getState } = Store
const Counter = () => {
    const count: Count = useSelector(state => state.count)

    // Watcher
    useEffect(() => {
        console.log('Count has been updated: ', getState().count)
    }, [getState().count])

    return (
        <div>
            <div>
                <button onClick={() => patchState('count', (count: Count) => count + 1)}>Increment</button>
                <button onClick={() => patchState('count', count - 1)}>Decrement</button>
                <button onClick={() => console.log(getState())}>Get State</button>
            </div>
            <h1>Count is: {count}</h1>
        </div>
    )
}
```

## Store API

### `useSelector`
props: `selector: (state: State) => any`, `deps: Array<any>`
return value: `State`   
description: Allows to subscribe to some value at the store, call render on changing value

### `getState`  
props: -  
return value: `State`   
description: Allows to get state. Unlike useSelector, it does not call the render

### `setState`  
props: `newState: State`  
return value: `void`   
description: set state

### `patchState`
props: `keyOrPath: string | string[]`, `callbackOrValue: any`
return value: `void`   
description: Patch state by path or key

