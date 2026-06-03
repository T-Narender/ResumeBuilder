import React from "react";

const HeaderBlock = ({ fullName, designation, contactInfo, theme }) => {
  const { email, phone, linkedin, github, location } = contactInfo || {};

  const displayLocation = location?.trim() || "";

  const contactParts = [];
  if (phone)
    contactParts.push({ key: "phone", label: phone, href: `tel:${phone}` });
  if (email)
    contactParts.push({ key: "email", label: email, href: `mailto:${email}` });
  if (linkedin)
    contactParts.push({ key: "linkedin", label: "LinkedIn", href: linkedin });
  if (github)
    contactParts.push({ key: "github", label: "GitHub", href: github });

  return (
    <header
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        textAlign: "center",
        marginBottom: "20px",
        color: "#1a1a1a",
      }}
    >
      <h1
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#1a1a1a",
          fontSize: "32px",
          fontWeight: 800,
          margin: 0,
          letterSpacing: "0.05em",
          marginBottom: "6px",
          lineHeight: 1.5,
        }}
      >
        {fullName}
      </h1>
      {displayLocation && (
        <div
          style={{
            fontSize: "12px",
            color: "#555",
            marginBottom: "6px",
            lineHeight: 1.5,
          }}
        >
          {displayLocation}
        </div>
      )}
        <div
          style={{
            fontSize: "12px",
            color: "#1a1a1a",
            margin: "0 0 12px 0",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            lineHeight: 1.5,
          }}
        >
        {contactParts.map((part, index) => (
          <React.Fragment key={part.key}>
            <a
              href={part.href}
              target={part.href.startsWith("http") ? "_blank" : undefined}
              rel={
                part.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              style={{
                fontSize: "12px",
                lineHeight: 1.5,
                color: "#1a1a1a",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {part.label}
            </a>
            {index < contactParts.length - 1 && (
              <span aria-hidden="true">|</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #ccc",
          margin: "12px 0 0 0",
        }}
      />
    </header>
  );
};

export default HeaderBlock;
