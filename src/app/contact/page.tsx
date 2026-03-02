import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <h1 className="text-3xl font-bold md:text-4xl">Contact Us</h1>
        <p className="mt-2 text-brand-white/60">
          Got a question, suggestion, or want to collaborate? We&apos;d love to hear from you.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-500">
                Email
              </h3>
              <p className="mt-2 text-brand-white/70">
                <a
                  href="mailto:hello@momenta.com.au"
                  className="transition-colors hover:text-gold-400"
                >
                  hello@momenta.com.au
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-500">
                Location
              </h3>
              <p className="mt-2 text-brand-white/70">Sydney, Australia</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-500">
                Social
              </h3>
              <div className="mt-2 flex flex-col gap-2">
                <a
                  href="#"
                  className="text-brand-white/70 transition-colors hover:text-gold-400"
                >
                  Instagram: @momenta.syd
                </a>
                <a
                  href="#"
                  className="text-brand-white/70 transition-colors hover:text-gold-400"
                >
                  WeChat: MomentaSydney
                </a>
                <a
                  href="#"
                  className="text-brand-white/70 transition-colors hover:text-gold-400"
                >
                  Facebook: Momenta Sydney
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-500">
                Response Time
              </h3>
              <p className="mt-2 text-sm text-brand-white/50">
                We typically respond within 24–48 hours.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
