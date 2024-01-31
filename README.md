# React Simple State

```
Effortlessly manage state in your React applications with this lightweight library. Say goodbye to the complexities of middleware handling and reduces headaches. Use it to seamlessly bind components state to specific values from your data store, ensuring efficient rendering based on data changes. Simplify your React development experience and enhance performance by focusing on the essentials, leaving behind the middleware complexities and reducer intricacies.
```

### How to import:
`import { StateProvider } from 'react-simple-state';`

### First step:
wrap you App in `<StateProvider />`:
```
    <StateProvider initialState={{ count: 0 }}>
        <App />
    </StateProvider>
```

### Counter Example:
```
    import { usePatchState, useWatchState } from 'react-simple-state';

    const Counter = () => {
    const count = useWatchState(state => state.count)
    const patchState = usePatchState()

    return <button onClick={() => patchState('count', count + 1)}>{count}</button>
    }
```

## API

### `<StateProvider />`
props: `initialState: Object`, `children`  
description: Wrap your App to allow using `react-simple-state` hooks

### `useWatchState`
props: `selector: Function`  
description: Allows to subscribe to some value at the store, call render on changing value

### `useGetState`
props: -  
return value: `Function`   
description: Allows to get state. Unlike useWatchState, it does not call the render

### `useSetState`
props: -  
return value: `(value: Function | any) => {}`   
description: Works similar to React useState setState

### `usePatchState`
props: -  
return value: `(path: 'String | String[]', value: Function | any) => {}`   
description: Patch state by path or key

