import {useState} from 'react'
import './App.css';
import { TextField, Button } from '@mui/material'

const App = () => {

  const [sku, setSku] = useState('')
  const [ stocks, setStockData ] = useState({})

  const onclickHandler = async () => {
    const response = await fetch(`http://localhost:4000/api/v1/stocks?sku=${sku}`, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin':'*'
      }
    })

    if (response.status !== 200) {
      setStockData({})
      setSku('')
      alert('No data found!')
      
    } else {
      const data = await response.json()
      setStockData({...stocks, data})
    }
  }

  return (
    <div className="App">
      <h1>Stock keeping Unit</h1>
      <TextField value={sku} onChange={(e) => setSku(e.target.value)} id="standard-basic" label="SKU" variant="standard" />
      <Button onClick={onclickHandler} variant="outlined">Submit</Button>
      <p>{Object.keys(stocks).length > 0 && JSON.stringify(stocks)}</p>
    </div>
    
  );
}

export default App;
