import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, AreaChart, Bar, BarChart, Legend
} from 'recharts';
import './Charts.css';

function generateProjection({ startAmount, monthlyContribution, annualRatePct, months }) {
  const monthlyRate = (annualRatePct / 100) / 12;
  const rows = [];
  let balance = startAmount;
  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    rows.push({ month: m, balance: Number(balance.toFixed(2)) });
  }
  return rows;
}

function Charts() {
  const [startAmount, setStartAmount] = useState('25000');
  const [monthlyContribution, setMonthlyContribution] = useState('5000');
  const [annualRatePct, setAnnualRatePct] = useState('8');
  const [years, setYears] = useState('3');

  const months = Math.max(0, Math.round((parseFloat(years) || 0) * 12));
  const projection = useMemo(() => generateProjection({
    startAmount: parseFloat(startAmount) || 0,
    monthlyContribution: parseFloat(monthlyContribution) || 0,
    annualRatePct: parseFloat(annualRatePct) || 0,
    months
  }), [startAmount, monthlyContribution, annualRatePct, months]);

  const totalInvested = useMemo(() => (parseFloat(startAmount) || 0) + (parseFloat(monthlyContribution) || 0) * months, [startAmount, monthlyContribution, months]);
  const finalBalance = projection.length ? projection[projection.length - 1].balance : 0;
  const totalReturns = Math.max(0, finalBalance - totalInvested);

  return (
    <div className="charts-page main-content">
      <h2 className="charts-title">Financial Charts</h2>
      <p className="charts-sub">Enter your details to visualize projected growth over time.</p>

      <div className="charts-grid">
        <div className="panel inputs">
          <div className="grid">
            <label>
              Starting Amount (₹)
              <input type="number" value={startAmount} onChange={e => setStartAmount(e.target.value)} />
            </label>
            <label>
              Monthly Contribution (₹)
              <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(e.target.value)} />
            </label>
            <label>
              Annual Return (% p.a.)
              <input type="number" value={annualRatePct} onChange={e => setAnnualRatePct(e.target.value)} />
            </label>
            <label>
              Years
              <input type="number" value={years} onChange={e => setYears(e.target.value)} />
            </label>
          </div>
          <div className="stats">
            <div>
              <span className="Total">Total Invested</span>
              <strong>₹{totalInvested.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span>Projected Value</span>
              <strong>₹{finalBalance.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span>Estimated Returns</span>
              <strong>₹{totalReturns.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        <div className="panel chart">
          <h3>Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={projection} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0b1220', border: '1px solid #1f2937' }} />
              <Area type="monotone" dataKey="balance" stroke="#60a5fa" fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel chart">
          <h3>Monthly Contributions vs Balance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={projection.slice(-12)} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0b1220', border: '1px solid #1f2937' }} />
              <Legend />
              <Bar dataKey="balance" name="Balance" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Charts;


