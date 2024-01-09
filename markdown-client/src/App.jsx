import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplitView from './components/MainPage/SplitView';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';

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
