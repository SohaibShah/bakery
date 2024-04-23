import React, { useState, useEffect } from 'react';
import sqlite3 from 'sqlite3';

import { product } from './interfaces/database';

const db = new sqlite3.Database("./database.db");

const App = () => {

  const [items, setItems] = useState<product[]>([])
  
  useEffect(() => {
    db.all('SELECT * from Product', (err, rows) => {
      if (err) {
        console.error("ERROee!");
        return;
      }
      setItems(rows as product[]);
    })
  }, [])
  
  
  return (
    <div>
      <h2>Product Data:</h2>
      <ul>
        {items.map((row, index) => (
          <li key={index}>{row.Pname}</li>
        ))}
      </ul>
    </div>
  )
}

export default App