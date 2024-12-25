
import { Route, Routes , BrowserRouter } from 'react-router-dom'
import Login from '../screens/login'
import Register from '../screens/register'
import Home from '../screens/Home'
import Project from '../screens/project'
import UserAuth from '../auth/UserAuth'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
     
      <Route path='/' element={ <UserAuth><Home/></UserAuth>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/project' element={ <UserAuth><Project/></UserAuth>}>

      </Route>
      
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes