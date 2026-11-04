import { useEffect, useState } from "react";

export const A4_HEIGHT_PX = 1122.52;
export const PRINT_MARGIN_PX = 20;
export const PRINTABLE_HEIGHT_PX = A4_HEIGHT_PX - PRINT_MARGIN_PX * 2;

const initialState = {
  pageCount: 1,
  isSinglePage: true,
  overflowAmount: 0,
  usagePercentage: 0,
  printableHeight: PRINTABLE_HEIGHT_PX,
  contentHeight: 0,
  warnings: [],
};

const getPrintableClone = (source) => {
  const clone = source.cloneNode(true);
  clone.querySelectorAll("[data-pdf-exclude]").forEach((element) => element.remove());
  clone.style.position = "absolute";
  clone.style.left = "-10000px";
  clone.style.top = "0";
  clone.style.width = "794px";
  clone.style.height = "auto";
  clone.style.minHeight = "0";
  clone.style.maxWidth = "none";
  clone.style.transform = "none";
  clone.style.visibility = "hidden";
  clone.style.boxSizing = "border-box";
  return clone;
};

const getWarnings = (source, contentHeight, printableHeight) => {
  if (!source || contentHeight <= printableHeight) return [];

  const sections = Array.from(source.querySelectorAll("section"));
  const largestSection = sections.reduce(
    (largest, section) =>
      section.getBoundingClientRect().height > largest.height
        ? { element: section, height: section.getBoundingClientRect().height }
        : largest,
    { element: null, height: 0 },
  );
  const warnings = [];
  if (largestSection.element && largestSection.height > printableHeight * 0.3) {
    const heading = largestSection.element.querySelector("h3");
    warnings.push(
      `${heading?.textContent?.trim() || "A section"} occupies significant space`,
    );
  }
  if (source.querySelectorAll("li").length > 12) {
    warnings.push("Experience or project sections contain many bullets");
  }
  return warnings;
};

export const measureResumePagination = (source) => {
  if (!source) return initialState;

  const clone = getPrintableClone(source);
  document.body.appendChild(clone);
  const contentHeight = Math.ceil(clone.getBoundingClientRect().height);
  clone.remove();

  const pageCount = Math.max(1, Math.ceil(contentHeight / PRINTABLE_HEIGHT_PX));
  return {
    pageCount,
    isSinglePage: pageCount === 1,
    overflowAmount: Math.max(0, contentHeight - PRINTABLE_HEIGHT_PX),
    usagePercentage: Math.round((contentHeight / PRINTABLE_HEIGHT_PX) * 100),
    printableHeight: PRINTABLE_HEIGHT_PX,
    contentHeight,
    warnings: getWarnings(source, contentHeight, PRINTABLE_HEIGHT_PX),
  };
};

export const useResumePagination = (resumeRef, enabled = true, refreshKey = null) => {
  const [pagination, setPagination] = useState(initialState);

  useEffect(() => {
    if (!enabled || !resumeRef?.current) return undefined;

    let frameId;
    let resizeObserver;
    let cancelled = false;

    const measure = () => {
      if (!cancelled) setPagination(measureResumePagination(resumeRef.current));
    };
    const scheduleMeasure = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(measure);
    };

    resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(resumeRef.current);
    scheduleMeasure();
    document.fonts?.ready.then(scheduleMeasure).catch(() => {
      scheduleMeasure();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [resumeRef, enabled, refreshKey]);

  return pagination;
};
