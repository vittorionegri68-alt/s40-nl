import React from "react";
import Icon from "./Icon.jsx";

// Slanted button from the S40 design system (skew -14deg, text counter-skewed).
// variant: primary (green) | secondary (outline) | dark | ghost
export default function Button({ children, variant = "primary", tone = "dark", icon, href, onClick, type = "button", size = "md", className = "", external, ...rest }) {
  const trailing = icon === undefined ? (variant === "primary" ? "arrow-right" : null) : icon;
  const Tag = href ? "a" : "button";
  const props = href ? { href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : { type, onClick };
  return (
    <Tag className={`btn btn--${variant} btn--${size} btn--on-${tone} ${className}`} {...props} {...rest}>
      <span className="btn__in">
        {children}
        {trailing ? <Icon name={trailing} size={size === "lg" ? 22 : 18} strokeWidth={2.5} /> : null}
      </span>
    </Tag>
  );
}
