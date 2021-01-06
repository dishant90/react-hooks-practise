import React, {useEffect, useRef, useState} from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  const {onLoadIngredients} = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const filterRef = useRef();
  const {isLoading, data, error, sendRequest, clear} = useHttp();

  useEffect( () => {
    const timer = setTimeout(() => {
      if(enteredFilter === filterRef.current.value) {
        const query = enteredFilter.length === 0 
          ? '' 
          : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest('https://react-hooks-practise-64684-default-rtdb.firebaseio.com/ingredients.json' + query, 'GET');
      }
    }, 500)
    return () => {
      clearTimeout(timer);
    }
  }, [enteredFilter, filterRef, sendRequest])

  useEffect(() => {
    if(!isLoading && !error && data) {
      const loadedIngredients = []
      for(let key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })
      }
      onLoadIngredients(loadedIngredients)
  }
  }, [data, isLoading, error, onLoadIngredients])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input 
            type="text"
            ref={filterRef}
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
