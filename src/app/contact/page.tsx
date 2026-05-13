import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ContactInfoPanel from "@/components/ContactInfoPanel";

export const metadata = {
  title: "Contact Us — Momenta",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <ContactInfoPanel />
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
