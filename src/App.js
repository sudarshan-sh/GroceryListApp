import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from './Alert';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }
  else{
    return [];
  }
}

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show:false, type:'', msg:'' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name){
      showAlert(true, 'danger', 'enter a value');
    }
    else if(name && isEditing){
      setList(
        list.map((item) => {
            if(item.id === editID){
              return {...item, title: name}
            }
            return item;
        })
      );
      setName('');
      setIsEditing(false);
      setEditID(null);
      showAlert(true, 'success', 'value changed');
    }
    else{
      showAlert(true, 'success', 'item added to the list');
      const newItem = {id: new Date().getTime().toString(), title: name};
      setList([...list, newItem]);
      setName('');
    }
  };

  const showAlert = (show=false, type='', msg='') =>{
    setAlert({ show, type, msg });
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  }

  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    setList(list.filter((item) => item.id !== id));
  }

  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setList([]);
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  })

  return (
    <section className="section-container">
      <form className="grocery-form" onSubmit={handleSubmit}>
        { alert.show && <Alert {...alert} removeAlert={showAlert} list={list} /> }
        <h3>grocery bud</h3>
        <div className="form-control">
          <input type="text" className="grocery"
          placeholder="e.g. pulses" 
          value={name} 
          onChange={(e) => setName(e.target.value)}  />
          <button type="submit" className="submit-btn">
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {
        list.length > 0 && (
          <div className="grocery-container">
            <List items={list} editItem={editItem} removeItem={removeItem} />
            <button className="clear-btn" onClick={clearList}>clear items</button>
          </div>
        )
      }
    </section>
  );
}

export default App;
