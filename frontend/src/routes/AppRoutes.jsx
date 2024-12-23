
import { Route, Routes , BrowserRouter } from 'react-router-dom'
import Login from '../screens/login'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<div>Home</div>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<div>Register</div>}></Route>
      
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes