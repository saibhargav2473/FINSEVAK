import React, { useMemo, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './Calculators.css';

function formatCurrency(value) {
  if (Number.isNaN(value)) return '₹0';
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function FDCalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('2');

  // Compound annually: A = P (1 + r/100)^t
  const maturity = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const A = P * Math.pow(1 + r, t);
    return A;
  }, [principal, rate, years]);

  return (
    <div className="calc-card">
      <h3>Fixed Deposit (FD)</h3>
      <div className="grid">
        <label>
          Principal (₹)
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </label>
        <label>
          Rate (% p.a.)
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} />
        </label>
        <label>
          Tenure (years)
          <input type="number" value={years} onChange={e => setYears(e.target.value)} />
        </label>
      </div>
      <div className="result">
        <div><span>Maturity Value</span><strong>{formatCurrency(Math.round(maturity))}</strong></div>
        <div><span>Total Interest</span><strong>{formatCurrency(Math.round(maturity - (parseFloat(principal) || 0)))}</strong></div>
      </div>
    </div>
  );
}

function RDCalculator() {
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('2');

  // Recurring deposit with monthly compounding approximation:
  // FV = P * [ ((1 + r/12)^(n) - 1) / (r/12) ] * (1 + r/12)
  const maturity = useMemo(() => {
    const P = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const n = (parseFloat(years) || 0) * 12;
    if (r === 0) return P * n;
    const i = r / 12;
    const FV = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    return FV;
  }, [monthly, rate, years]);

  return (
    <div className="calc-card">
      <h3>Recurring Deposit (RD)</h3>
      <div className="grid">
        <label>
          Monthly Deposit (₹)
          <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} />
        </label>
        <label>
          Rate (% p.a.)
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} />
        </label>
        <label>
          Tenure (years)
          <input type="number" value={years} onChange={e => setYears(e.target.value)} />
        </label>
      </div>
      <div className="result">
        <div><span>Maturity Value</span><strong>{formatCurrency(Math.round(maturity))}</strong></div>
        <div><span>Total Deposit</span><strong>{formatCurrency((parseFloat(monthly) || 0) * ((parseFloat(years) || 0) * 12))}</strong></div>
      </div>
    </div>
  );
}

function LoanCalculator() {
  const [principal, setPrincipal] = useState('1000000');
  const [rate, setRate] = useState('9');
  const [years, setYears] = useState('5');

  // EMI formula: E = P r (1+r)^n / [(1+r)^n - 1]
  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const annual = (parseFloat(rate) || 0) / 100;
    const r = annual / 12;
    const n = (parseFloat(years) || 0) * 12;
    if (r === 0 || n === 0) {
      const simpleEmi = n ? P / n : 0;
      return { emi: simpleEmi, totalInterest: 0, totalPayment: P };
    }
    const pow = Math.pow(1 + r, n);
    const E = (P * r * pow) / (pow - 1);
    const total = E * n;
    return { emi: E, totalInterest: total - P, totalPayment: total };
  }, [principal, rate, years]);

  return (
    <div className="calc-card">
      <h3>Loan EMI</h3>
      <div className="grid">
        <label>
          Loan Amount (₹)
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </label>
        <label>
          Interest Rate (% p.a.)
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} />
        </label>
        <label>
          Tenure (years)
          <input type="number" value={years} onChange={e => setYears(e.target.value)} />
        </label>
      </div>
      <div className="result">
        <div><span>Monthly EMI</span><strong>{formatCurrency(Math.round(emi))}</strong></div>
        <div><span>Total Interest</span><strong>{formatCurrency(Math.round(totalInterest))}</strong></div>
        <div><span>Total Payment</span><strong>{formatCurrency(Math.round(totalPayment))}</strong></div>
      </div>
    </div>
  );
}

function CalculatorsOverview() {
  return (
    <div className="calcs-page main-content">
      <h2 className="calcs-title">Financial Calculators</h2>
      <p className="calcs-sub">Choose a calculator to get started.</p>
      <div className="overview-grid">
        <div className="overview-card">
          <div className="card-head">
            <h3>Fixed Deposit (FD)</h3>
            <span className="emoji">🏦</span>
          </div>
          <p>Estimate your FD maturity and interest earned using annual compounding.</p>
          <Link className="overview-btn" to="fd">Open FD Calculator</Link>
        </div>
        <div className="overview-card">
          <div className="card-head">
            <h3>Recurring Deposit (RD)</h3>
            <span className="emoji">📈</span>
          </div>
          <p>Project RD maturity with monthly contributions and compounding.</p>
          <Link className="overview-btn" to="rd">Open RD Calculator</Link>
        </div>
        <div className="overview-card">
          <div className="card-head">
            <h3>Loan EMI</h3>
            <span className="emoji">💳</span>
          </div>
          <p>Calculate monthly EMI, total interest, and total payment for your loan.</p>
          <Link className="overview-btn" to="loan">Open Loan Calculator</Link>
        </div>
      </div>
    </div>
  );
}

function FDPage() {
  const navigate = useNavigate();
  return (
    <div className="calcs-page main-content">
      <button className="back-link" onClick={() => navigate('/calculators')}>← All Calculators</button>
      <FDCalculator />
    </div>
  );
}

function RDPage() {
  const navigate = useNavigate();
  return (
    <div className="calcs-page main-content">
      <button className="back-link" onClick={() => navigate('/calculators')}>← All Calculators</button>
      <RDCalculator />
    </div>
  );
}

function LoanPage() {
  const navigate = useNavigate();
  return (
    <div className="calcs-page main-content">
      <button className="back-link" onClick={() => navigate('/calculators')}>← All Calculators</button>
      <LoanCalculator />
    </div>
  );
}

function Calculators() {
  return (
    <Routes>
      <Route index element={<CalculatorsOverview />} />
      <Route path="fd" element={<FDPage />} />
      <Route path="rd" element={<RDPage />} />
      <Route path="loan" element={<LoanPage />} />
    </Routes>
  );
}

export default Calculators;


