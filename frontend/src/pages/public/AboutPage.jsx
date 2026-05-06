import { OFFICE_ADDRESS, OFFICE_PHONES } from "../../data/propertyTypes";

export default function AboutPage() {
  return (
    <main className="container-page py-12">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow">About the office</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            Local Siddipet property support from Pragnapur.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            This platform helps buyers discover properties and helps agents manage listings. Final negotiation, documentation, site visits, and deal closure happen offline through the physical office and trusted local agents.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg">
          <img
            alt="Real estate office discussion"
            className="h-96 w-full object-cover"
            src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1400&q=85"
          />
        </div>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {[
          ["Local expertise", "Mandal and village-level awareness across Siddipet district."],
          ["Verified communication", "Buyers contact agents through calls, WhatsApp, and inquiry forms."],
          ["Offline trust", "No payment gateway, no checkout, no booking engine. Deals happen in person."],
        ].map(([title, description]) => (
          <div className="card p-6" key={title}>
            <h2 className="text-lg font-black">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-lg bg-brand-900 p-8 text-white">
        <p className="eyebrow text-brand-100">Office details</p>
        <h2 className="mt-3 text-2xl font-black">Visit or call the Pragnapur office</h2>
        <p className="mt-4 text-slate-200">{OFFICE_ADDRESS}</p>
        <div className="mt-5 flex flex-wrap gap-4">
          {OFFICE_PHONES.map((phone) => (
            <a className="inline-flex font-black text-white underline" href={`tel:${phone.href}`} key={phone.href}>
              {phone.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
