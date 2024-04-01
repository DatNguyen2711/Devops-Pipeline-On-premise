import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import React from 'react'
import Cart from './Components/users/Cart';
import MedicineDisplay from './Components/users/MedicineDisplay';
import AdminOrder from './Components/admin/AdminOrder';
import CustomerList from './Components/admin/CustomerList';
import Medicine from './Components/admin/Medicine';
import Login from './Components/auth/Login';
import Order from './Components/users/Order';
import Dashboard from './Components/users/Dashboard';
import Register from './Components/auth/Register';
import AdminDashboard from "./Components/admin/AdminDashboard";
import OrderDetail from "./Components/users/OrderDetail";


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/order' element={<Order />} />
          <Route path='/order/:id' element={<OrderDetail />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/medicine' element={<MedicineDisplay />} />



          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/order' element={<AdminOrder />} />
          <Route path='/admin/customer' element={<CustomerList />} />
          <Route path='/admin/medicine' element={<Medicine />} />



        </Routes>
      </Router>
    </>
  )
}

export default App
