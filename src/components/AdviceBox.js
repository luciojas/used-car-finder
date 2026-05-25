import React from "react";

function AdviceBox({ advice }) {
  if (!advice) return null;
  return (
    <div className="advice-box">
      <h3>💡 Buying Advice</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{advice}</p>
    </div>
  );
}

export default AdviceBox;