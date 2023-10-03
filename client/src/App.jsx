import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/navbar/Navbar"
import Step1 from "./pages/step1/Step1"
import Sidebar from "./components/sidebar/Sidebar"
import Step2 from "./pages/step2/Step2"

function App() {

  return (
    <>
     <div>
      <div className="grid ">
        <Navbar/>
        <div className="grid grid-cols-6">
          <div className="col-span-1">

          <Sidebar/>
          </div>

        <Routes>
          <Route path='/' element={<Step1/>}/>
          <Route path='/step2' element={<Step2/>}/>
        </Routes>
        </div>

      </div>
     </div>
    </>
  )
}

export default App
