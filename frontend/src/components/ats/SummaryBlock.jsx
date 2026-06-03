import React from "react";
import SectionHeader from "./SectionHeader";

const SummaryBlock = ({ summary, theme }) => {
  if (!summary) return null;

  return (
    <section>
      <SectionHeader title="Professional Summary" />
      <p
        style={{ margin: 0, fontSize: "12px", color: "#333", lineHeight: 1.5 }}
      >
        {summary}
      </p>
    </section>
  );
};

export default SummaryBlock;
