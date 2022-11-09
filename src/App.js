import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

import SignIn from './components/SignIn'
import Home from './components/Home'
import TestDemo from './components/TestDemo'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path='/signin' element={<SignIn />} />
          {/* <Route path='/test' element={<TestDemo />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
