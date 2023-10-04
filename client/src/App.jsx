import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

import Step1 from "./pages/step1/Step1";
import Step2 from "./pages/step2/Step2";
import Step3 from "./pages/step3/Step3";
import Step4 from "./pages/step4/Step4";
import Step5 from "./pages/step5/Step5";

function App() {
  return (
    <>
      <div>
        <Navbar />
        <div className='flex items-center h-full gap-4'>
          <div className='h-[90vh] overflow-x-hidden flex flex-col text-[#333] font-bold w-14 md:w-1/6 bg-[#d3d3d3] justify-around py-14 items-center'>
            <Sidebar />
          </div>

          <Routes>
            <Route path='/website' element={<Step1 />} />
            <Route path='/articles' element={<Step2 />} />
            <Route path='/posts' element={<Step3 />} />
            <Route path='/schedule' element={<Step4 />} />
            <Route path='/comment' element={<Step5 />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
