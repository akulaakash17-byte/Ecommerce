import { useEffect } from "react";

export function useDocumentMeta({ title, description, canonicalPath = "" }) {
  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") || "";
    let canonical = document.querySelector('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute("href") || "";

    document.title = title;

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", `${window.location.origin}${canonicalPath || window.location.pathname}`);

    return () => {
      document.title = previousTitle;
      if (metaDescription) metaDescription.setAttribute("content", previousDescription);
      if (canonical && previousCanonical) canonical.setAttribute("href", previousCanonical);
    };
  }, [canonicalPath, description, title]);
}
