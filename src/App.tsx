// export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import TaskPage from "./pages/TaskPage/TaskPage";

// import MainLayout from "./components/MainLayout/MainLayout";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="App">
//         <Routes>
//           <Route element={<MainLayout />}>
//             <Route path="/" element={<TaskPage />} />
//           </Route>
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TaskPage from "./pages/TaskPage/TaskPage";
import MainLayout from "./components/MainLayout/MainLayout";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<TaskPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
