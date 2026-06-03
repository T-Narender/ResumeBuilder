import React from "react";

const SectionHeader = ({ title }) => {
  return (
    <div style={{ marginTop: "14px", marginBottom: "0px" }}>
      <h2
        style={{
          fontSize: "14px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          margin: "0 0 6px 0",
          lineHeight: 1.5,
          color: "#1a1a1a",
        }}
      >
        {title}
      </h2>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e0e0e0",
          margin: "0 0 12px 0",
        }}
      />
    </div>
  );
};

export default SectionHeader;
