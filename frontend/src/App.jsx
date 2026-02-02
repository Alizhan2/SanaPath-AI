import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Landing from './pages/Landing';
import Survey from './pages/Survey';
import Recommendations from './pages/Recommendations';
import Community from './pages/Community';

function App() {
  const [recommendations, setRecommendations] = useState(null);
  const [userData, setUserData] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-hero-pattern">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/survey" 
            element={
              <Survey 
                setRecommendations={setRecommendations} 
                setUserData={setUserData}
              />
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <Recommendations 
                recommendations={recommendations}
                userData={userData}
              />
            } 
          />
          <Route path="/community" element={<Community />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
