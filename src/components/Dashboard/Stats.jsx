import React from 'react';

const Stats = ({ stats }) => (
  <section style={{ padding: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
    {stats.map((stat, index) => (
      <div key={index} style={{ 
        backgroundColor: 'white', padding: '20px', borderRadius: '18px', 
        display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e2e8f0' 
      }}>
        <div style={{ backgroundColor: `${stat.color}15`, padding: '10px', borderRadius: '10px', color: stat.color }}>
          {stat.icon}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{stat.label}</p>
          <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{stat.value}</p>
        </div>
      </div>
    ))}
  </section>
);

export default Stats;