import React from "react";
import { CircleCheck, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-brand">
        <CircleCheck />
        <p>TaskFlow</p>
      </div>
      <span>Designed by Hicham Abbouz and Sanaa Omari Alaoui</span>
      <div className="footer-socials">
        <a
          href="https://www.linkedin.com/in/hichamabbouz/"
          className="footer-social-link"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn Hicham Abbouz"
          title="LinkedIn Hicham Abbouz"
        >
          <ExternalLink />
        </a>
        <a
          href="https://www.linkedin.com/in/sanaa-omari-alaoui-/"
          className="footer-social-link"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn Sanaa Omari Alaoui"
          title="LinkedIn Sanaa Omari Alaoui"
        >
          <ExternalLink />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
