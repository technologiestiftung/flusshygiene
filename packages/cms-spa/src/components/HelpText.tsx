import React from "react";

export const HelpText: React.FC = () => {
  return (
    <div className="content">
      <h1>Hilfe zur Plattform</h1>
      <p>
        Eine ausführliche Dokumentation finden Sie in diesem{" "}
        <a
          href="https://docs.google.com/document/d/1-_5ObrwQGtX03ZrIyXCgoDTpG-JEK216MaAeLZbwRWE/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Doc.
        </a>{" "}
        Dort haben Sie auch die Möglichkeit zu kommentieren. Oder schreiben Sie
        eine E-Mail an:{" "}
        <a
          href={`mailto:${process.env.REACT_APP_ADMIN_MAIL}?subject=[Flussbaden]`}
        >
          {process.env.REACT_APP_ADMIN_MAIL}
        </a>
      </p>
    </div>
  );
};
