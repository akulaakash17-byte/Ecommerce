import InquiryForm from "../../components/forms/InquiryForm";
import { OFFICE_ADDRESS, OFFICE_PHONES } from "../../data/propertyTypes";

export default function ContactPage() {
  const mapQuery = encodeURIComponent(OFFICE_ADDRESS);

  return (
    <main className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-5xl">Talk to the Siddipet property team.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
            Send your requirement, call the office, or visit Pragnapur for offline property guidance.
          </p>
          <div className="mt-8 space-y-4">
            <div className="card p-5">
              <p className="text-sm font-black uppercase text-slate-500">Office address</p>
              <p className="mt-2 font-bold">{OFFICE_ADDRESS}</p>
            </div>
            <div className="card p-5">
              <p className="text-sm font-black uppercase text-slate-500">Phone</p>
              <div className="mt-2 space-y-2">
                {OFFICE_PHONES.map((phone) => (
                  <a className="block font-bold text-brand-700" href={`tel:${phone.href}`} key={phone.href}>
                    {phone.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-xl font-black">Inquiry form</h2>
          <div className="mt-5">
            <InquiryForm />
          </div>
        </section>
      </div>

      <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <iframe
          className="h-96 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          title="Office location map"
        />
      </div>
    </main>
  );
}
