import React from "react";

function AdviceBox({ advice }) {
  if (!advice) return null;
  return (
    <div style={{ background: '#f0f7ff', border: '1px solid #b3d4f5', borderRadius: 8, padding: 16, margin: '16px 0' }}>
      <h3 style={{ margin: '0 0 8px' }}>💡 Buying Advice</h3>
      <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{advice}</p>
    </div>
  );
}

export default AdviceBox;