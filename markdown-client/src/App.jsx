import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplitView from './components/SplitView';
import Signup from './components/Signup';
import Login from './components/Login';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SplitView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
}
