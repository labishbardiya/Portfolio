import { ResumeViewer } from "@/components/resume-viewer";

export default function ResumePage() {
  return (
    <main className="page-shell content-page">
      <p className="eyebrow">Resume</p>
      <h1>A more traditional version of me.</h1>
      <ResumeViewer />
    </main>
  );
}
