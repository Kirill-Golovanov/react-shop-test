// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// // src/App.tsx
// import React, { Suspense } from 'react';
// import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
// import HomePage from './pages/HomePage/HomePage';
// import MainPage from './pages/MainPage/MainPage';
// import TaskPage from "./pages/TaskPage/TaskPage";
// import SearchScreen from './components/SearchScreen/SearchScreen';
// import MainLayout from './components/MainLayout/MainLayout';



// function App() {
//   return (
//     <BrowserRouter>
//       <Suspense fallback={<div>Загрузка...</div>}>
//         {" "}
//         {/* Suspense для динамических импортов */}
//         <div className="App">
//           <Routes>
//             <Route element={<MainLayout />}>
//               <Route path="/" element={<TaskPage />} />
//             </Route>
//           </Routes>
//         </div>
//       </Suspense>
//     </BrowserRouter>

//     // <Router>
//     //   <Routes>
//     //     {/* <Route path="/" element={<HomePage />} /> */}
//     //     {/* <Route path="/" element={<MainPage />} /> */}
//     //     <Route path="/" element={<TaskPage />} />
//     //     {/* <Route
//     //       path="/search"
//     //       element={<SearchScreen products= {products} />}
//     //     />{" "} */}
//     //     {/* Страница поиска */}
//     //   </Routes>
//     // </Router>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";


import TaskPage from "./pages/TaskPage/TaskPage";

import MainLayout from "./components/MainLayout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<TaskPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
