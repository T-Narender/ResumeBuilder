import React from "react";
import SectionHeader from "./SectionHeader";

const SkillsBlock = ({ skills, theme }) => {
  if (!skills || Object.keys(skills).length === 0) return null;

  let categories = {};
  if (Array.isArray(skills)) {
    skills.forEach((s) => {
      const cat = s.category || "Tools";
      if (!categories[cat]) categories[cat] = [];
      if (s.name) categories[cat].push(s.name);
    });
  } else {
    categories = skills;
  }

  if (Object.keys(categories).length === 0) return null;

  const orderedCategories = [
    "Languages",
    "Frontend",
    "Backend",
    "Database",
    "Tools",
  ];
  const categoryEntries = [
    ...orderedCategories
      .filter(
        (category) => categories[category] && categories[category].length > 0,
      )
      .map((category) => [category, categories[category]]),
    ...Object.entries(categories).filter(
      ([category, items]) =>
        !orderedCategories.includes(category) && items && items.length > 0,
    ),
  ];

  return (
    <section>
      <SectionHeader title="Skills" />
      <div>
        {categoryEntries.map(([category, items]) => {
          if (!items || items.length === 0) return null;
          const values = Array.isArray(items) ? items.join(", ") : items;
          const shouldBold = [
            "programming languages",
            "frontend technologies",
            "backend technologies"
          ].some(val => category.toLowerCase().includes(val));

          return (
            <div
              key={category}
              style={{
                marginBottom: "4px",
                fontSize: "12px",
                lineHeight: 1.5,
                color: "#1a1a1a",
              }}
            >
              {shouldBold ? (
                <>
                  <strong style={{ fontWeight: 700 }}>{category}:</strong> {values}
                </>
              ) : (
                `${category}: ${values}`
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SkillsBlock;
