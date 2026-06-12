import React from "react";

const PageHeader = ({ eyebrow, title, description }) => {
  return (
    <section className="page-header">
      <p className="ui-kicker">{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </section>
  );
};

export default PageHeader;
