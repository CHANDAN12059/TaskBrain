import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/components/Dashboard";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";





import UpdateAdminStatus from "./pages/components/UpdateAdminStaus";
import UpdateStatus from "./pages/components/UpdateStatus";
import CreateTasks from "./pages/components/CreateTasks";
import Navbar from "./pages/components/navbar";

function App() {
  return (
    <>
       
      <BrowserRouter>
<Navbar/>
        <Routes>
        <Route path="/" element={<SignUp/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

    
    <Route path="dashboard" element={<Dashboard />} />
  
    <Route path="/task/:id" element={<UpdateStatus />} />  
    <Route path="/admin/task/:id" element={<UpdateAdminStatus />} />  
    <Route path="/create" element={<CreateTasks />} />    
   



        </Routes>
      </BrowserRouter>

     

    </>
  );
}

export default App;
