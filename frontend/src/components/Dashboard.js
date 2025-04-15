import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#28a745', '#ffc107', '#dc3545'];

const Dashboard = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  useEffect(() => {
    console.log("Results in Dashboard:", results);
  }, [results]);

  const predictions = Array.isArray(results) ? results : (results?.predictions || []);

  const riskData = [
    { name: 'Low', value: predictions.filter(r => r.RiskLevel === 'Low').length },
    { name: 'Medium', value: predictions.filter(r => r.RiskLevel === 'Medium').length },
    { name: 'High', value: predictions.filter(r => r.RiskLevel === 'High').length },
  ];

  const getRowColor = (risk) => {
    switch (risk) {
      case 'High': return '#f8d7da';
      case 'Medium': return '#fff3cd';
      case 'Low': return '#d4edda';
      default: return 'white';
    }
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(predictions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'fraud_analysis_results.csv');
  };

  const filteredPredictions = predictions.filter(r => {
    const matchesVendor = r.Vendor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || r.RiskLevel === riskFilter;
    return matchesVendor && matchesRisk;
  });

  const handleScrollToRisk = () => {
    const riskSection = document.getElementById('risk-distribution');
    if (riskSection) {
      riskSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>📊 Dashboard Insights</h2>

      {predictions.length > 0 ? (
        <>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <input
                type="text"
                placeholder="🔍 Search vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  flex: '1',
                  fontSize: '1rem',
                  minWidth: '200px'
                }}
              />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                style={{
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              >
                <option value="All">All Risks</option>
                <option value="Low">🟢Low</option>
                <option value="Medium">🟡Medium</option>
                <option value="High">🔴High</option>
              </select>
  
              

              <button
  onClick={() => window.print()}
  style={{
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(40, 167, 69, 0.3)'
  }}
>
  🖨️ Print / Save as PDF
</button>





            </div>
            {/* Risk Distribution Button */}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                onClick={handleScrollToRisk}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(40, 167, 69, 0.3)'
                }}
              >
                📊 Risk Distribution
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            marginBottom: '2rem'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f1f3f5' }}>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Vendor</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Contract ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Risk Score</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Risk Level</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Flagged Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredPredictions.map((r, index) => (
                  <tr key={index} style={{ backgroundColor: getRowColor(r.RiskLevel) }}>
                    <td style={{ padding: '0.75rem' }}>{r.Vendor || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{r.ContractID || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{r.RiskScore || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{r.RiskLevel || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{r.FlaggedReason || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dashboard-cards" style={{
            marginTop: '2rem',
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div className="card" style={{
              flex: '1',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>📈 Risk Distribution</h3>
              {/* Add an id here for the scrolling target */}
              <div id="risk-distribution">
                <PieChart width={300} height={250}>
                  <Pie
                    data={riskData}
                    cx={150}
                    cy={100}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {riskData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>

            <div className="card" style={{
              flex: '1',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ color: '#2c3e50' }}>ℹ️ About Us</h3>
              <p style={{ fontWeight: 'bold' }}>Empowering Transparent Governance with AI</p>
              <p>
                At ProcureShield AI, we're on a mission to combat procurement fraud and bring
                transparency, accountability, and trust back to public sector spending.
              </p>
              <p>
                Each year, billions of dollars are lost globally due to fraudulent procurement
                activities such as overpricing, fake vendors, and contract violations. These issues
                delay critical infrastructure projects, deliver poor-quality services, and erode
                public confidence.
              </p>
              <p>
                Our platform leverages cutting-edge AI and machine learning to detect fraud
                patterns before they cause real harm. Built with precision, explainability, and
                scalability in mind, ProcureShield AI is designed to support governments, auditors,
                and enterprises in making smarter, fraud-free procurement decisions.
              </p>
            </div>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>No predictions found.</p>
      )}
    </div>
  );
};

export default Dashboard;
