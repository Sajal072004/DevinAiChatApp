
import { Route, Routes , BrowserRouter } from 'react-router-dom'
import Login from '../screens/login'
import Register from '../screens/register'
import Home from '../screens/Home'
import Project from '../screens/project'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/project' element={<Project/>}>

      </Route>
      
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes