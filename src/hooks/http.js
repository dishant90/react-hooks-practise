import {useCallback, useReducer} from 'react'

const initialState = {isLoading: false, error: null, data: null, extra: null, identifier: null};

const httpStateReducer = (curHttpState, action) => {
    switch(action.type) {
    case 'SEND':
        return {isLoading: true, error: null, data: null, extra: null, identifier: null};
    case 'RESPONSE':
        return {...curHttpState, isLoading: false, data: action.responseData, extra: action.extra, identifier: action.identifier};
    case 'ERROR':
        return {isLoading: false, error: action.errorMessage};
    case 'CLEAR':
        return initialState;
    default:
        throw new Error('Should not be here!');
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpStateReducer, initialState);

    const clear = useCallback(() => {
        dispatchHttp({type: 'CLEAR'})
    }, [])

    const sendRequest = useCallback((url, method, body, extra, identifier) => {
        dispatchHttp({type: 'SEND'});
        fetch(url, {
          method: method,
          body: body,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
            return response.json()
        }).then(responseData => {
          dispatchHttp({type: 'RESPONSE', responseData: responseData, extra: extra, identifier: identifier});
        }).catch(error => {
          dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'});
        })
    }, [])

    return {
        isLoading: httpState.isLoading,
        error: httpState.error,
        data: httpState.data,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear
    }
    
}

export default useHttp;