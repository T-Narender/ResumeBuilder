import React from "react";
import SectionHeader from "./SectionHeader";

const CertificationsBlock = ({ certifications, theme }) => {
  if (!certifications || certifications.length === 0) return null;

  const validCerts = certifications.filter((cert) => cert.title);
  if (validCerts.length === 0) return null;

  return (
    <section style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <SectionHeader title="Certifications" />
      <div>
        <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
          {validCerts.map((cert, index) => (
            <li
              key={index}
              style={{ marginBottom: "4px", lineHeight: 1.5, fontSize: "12px" }}
            >
              <span
                style={{
                  fontWeight: 600,
                  color: theme?.primaryColor || "#111827",
                }}
              >
                {cert.title}
              </span>
              {cert.issuer && (
                <span style={{ color: "#666" }}> — {cert.issuer}</span>
              )}
              {cert.year && (
                <span style={{ color: "#666" }}> ({cert.year})</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CertificationsBlock;
