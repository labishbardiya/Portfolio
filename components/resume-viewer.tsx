import { Download, ExternalLink } from "lucide-react";

const resumePath = "/labish-bardiya-resume.pdf";

export function ResumeViewer() {
  return (
    <div className="resume-viewer">
      <div className="resume-actions">
        <p>One page. The work, the experiments, and the receipts.</p>
        <div>
          <a href={resumePath} download>
            <Download size={15} aria-hidden="true" /> Download PDF
          </a>
          <a href={resumePath} target="_blank" rel="noreferrer">
            <ExternalLink size={15} aria-hidden="true" /> Open full size
          </a>
        </div>
      </div>
      <iframe className="resume-frame" src={resumePath} title="Labish Bardiya resume" />
    </div>
  );
}
