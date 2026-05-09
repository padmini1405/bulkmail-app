import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import BulkMail from './Components/BulkMail';
import SignUp from './Components/SignUp';
import History from './Components/History';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/bulkmail' element={<BulkMail />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/history' element={<History />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
