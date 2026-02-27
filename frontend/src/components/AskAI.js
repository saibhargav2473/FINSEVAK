import  { useState } from 'react';
import axios from 'axios';
import './AskAI.css';

function AskAI() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [goal, setGoal] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const data = { income, expenses, goal, customQuestion };

    try {
      const res = await axios.post('http://localhost:3000/api/ask', data);
      setResponse(res.data.answer);
    } catch (err) {
      console.error(err);
      setResponse("Error connecting to advisor.");
    }
  };

  return (
    <div className="ask-container">
      <h2> Financial Advisor</h2>

      <label>Monthly Income (₹):</label>
      <input type="number" value={income} onChange={e => setIncome(e.target.value)} />

      <label>Monthly Expenses (₹):</label>
      <input type="number" value={expenses} onChange={e => setExpenses(e.target.value)} />

      <label>Savings Goal (₹):</label>
      <input type="number" value={goal} onChange={e => setGoal(e.target.value)} />

      <label>Additional Question:</label>
      <textarea rows={4} value={customQuestion} onChange={e => setCustomQuestion(e.target.value)} />

      <button onClick={handleSubmit}>Ask Advisor</button>

      {response && (
        <div className="response-box">
          <h3>💡 Advisor Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default AskAI;
