import './Home.css'
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const handleNavClick = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <main className="home-hero main-content">
        <section className="home-wrap">
          <div className="home-badge">FinSevak</div>
          <h1>Smart financial guidance, simplified.</h1>
          <p className="home-sub">FinSevak is your AI-powered assistant to plan budgets, learn finance, and make better money decisions.</p>
          <div className="home-cta">
            <button className="home-btn primary" onClick={() => navigate("/ask")}>Ask AI</button>
            <button className="home-btn ghost" onClick={() =>navigate("/learning")}>Start Learning</button>
          </div>
        </section>
      </main>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <h2>About FinSevak</h2>
          <p className="about-description">
            FinSevak combines intelligent advice with interactive learning to help you understand and improve your finances.
            Ask questions, plan for goals, and test yourself with bite-sized quizzes.
          </p>
          <div className="features">
            <div className="feature">
              <div className="icon">🤖</div>
              <h3>AI Advisor</h3>
              <p>Personalized insights for budgeting, saving, and goal planning.</p>
            </div>
            <div className="feature">
              <div className="icon">📘</div>
              <h3>Learn by Doing</h3>
              <p>MCQ quizzes to strengthen your financial basics.</p>
            </div>
            <div className="feature">
              <div className="icon">🔒</div>
              <h3>Privacy First</h3>
              <p>No backend changes, no data stored—your inputs stay on your device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Ask Questions</h3>
                <p>Simply type your financial questions or describe your situation. Our AI understands context and provides tailored advice.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Get Insights</h3>
                <p>Receive personalized recommendations for budgeting, saving strategies, investment options, and financial planning.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Learn & Practice</h3>
                <p>Test your knowledge with interactive quizzes and build confidence in making informed financial decisions.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Take Action</h3>
                <p>Apply the insights to your real financial situation and track your progress toward your goals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us" id="about-us">
        <div className="container">
          <div className="about-us-content">
            <div className="about-text">
              <h2>About Us</h2>
              <p>
                FinSevak was born from the belief that everyone deserves access to quality financial guidance, 
                regardless of their background or economic status. Our mission is to democratize financial literacy 
                through the power of artificial intelligence.
              </p>
              <p>
                We understand that financial decisions can be overwhelming, and traditional financial advice 
                isn't always accessible or affordable. That's why we created an intelligent, user-friendly 
                platform that puts financial wisdom at your fingertips.
              </p>
              <div className="mission-values">
                <div className="mission">
                  <h4>Our Mission</h4>
                  <p>To empower individuals with the knowledge and tools they need to make confident financial decisions and build a secure financial future.</p>
                </div>
                <div className="values">
                  <h4>Our Values</h4>
                  <ul>
                    <li>Accessibility for all</li>
                    <li>Privacy and security</li>
                    <li>Continuous learning</li>
                    <li>Practical guidance</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="stats">
                <div className="stat">
                  <h3>10,000+</h3>
                  <p>Questions Answered</p>
                </div>
                <div className="stat">
                  <h3>95%</h3>
                  <p>User Satisfaction</p>
                </div>
                <div className="stat">
                  <h3>24/7</h3>
                  <p>Available Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="disclaimer" id="disclaimer">
        <div className="container">
          <h2>Important Disclaimer</h2>
          <div className="disclaimer-content">
            <div className="disclaimer-card">
              <h3>⚠️ Not Professional Financial Advice</h3>
              <p>
                FinSevak provides educational information and general guidance only. The content and recommendations 
                are not intended as professional financial, investment, tax, or legal advice. Always consult with 
                qualified professionals before making significant financial decisions.
              </p>
            </div>
            <div className="disclaimer-card">
              <h3>🔬 AI-Generated Content</h3>
              <p>
                Our responses are generated by artificial intelligence and may not always be accurate or complete. 
                While we strive for quality, please verify important information from authoritative sources before 
                taking action.
              </p>
            </div>
            <div className="disclaimer-card">
              <h3>📊 Personal Responsibility</h3>
              <p>
                You are responsible for your own financial decisions. FinSevak cannot guarantee specific outcomes 
                or be held liable for any losses that may result from using our platform or following our suggestions.
              </p>
            </div>
          
          </div>
        </div>
      </section>

     

      
    </div>
  );
}

export default Home;