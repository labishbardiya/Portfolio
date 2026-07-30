import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="page-shell content-page">
      <p className="eyebrow">Contact</p>
      <h1>Let&apos;s make something useful.</h1>
      <p className="page-intro">Have an idea, a useful problem, or a project that needs a curious builder? Say hi.</p>
      <ContactForm />
    </main>
  );
}
