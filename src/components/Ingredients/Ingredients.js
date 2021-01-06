import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.ingredientId);
    default:
      throw new Error('Should not reach here!');
  }
}

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} = useHttp();

  useEffect(() => {
    if(!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', ingredient: {id: data.name, ...reqExtra}})
    } else if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', ingredientId: reqExtra})
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error])

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []); 

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest('https://react-hooks-practise-64684-default-rtdb.firebaseio.com/ingredients.json', 
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT')
  }, [sendRequest])

  const removeIngredientHandler = useCallback((ingredientId) => {
    sendRequest(
      `https://react-hooks-practise-64684-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE', 
      null, 
      ingredientId,
      'REMOVE_INGREDIENT')
  }, [sendRequest])

  const ingredientList = useMemo( () => {
    return (
      <IngredientList 
        ingredients={ingredients} 
        onRemoveItem={removeIngredientHandler} />
    )
  }, [ingredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={isLoading} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
