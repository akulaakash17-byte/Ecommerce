import { useState } from "react";
import { Link } from "react-router-dom";
import { FAQS } from "../../data/faqs";

export default function FaqPage() {
  const [openQuestion, setOpenQuestion] = useState("Can I buy or pay for a property online?");

  return (
    <main className="container-page py-12">
      <section className="max-w-3xl">
        <p className="eyebrow">FAQ</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
          Common questions about Siddipet property discovery.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-700">
          Quick answers about listings, site visits, office contact, verification, and the offline deal process.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {FAQS.map((group) => (
            <div className="card overflow-hidden" key={group.category}>
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                <h2 className="text-lg font-black text-slate-950">{group.category}</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {group.items.map((item) => {
                  const isOpen = openQuestion === item.question;

                  return (
                    <div key={item.question}>
                      <button
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-black text-slate-900 hover:bg-slate-50"
                        onClick={() => setOpenQuestion(isOpen ? "" : item.question)}
                        type="button"
                      >
                        <span>{item.question}</span>
                        <span className="text-xl text-brand-700">{isOpen ? "-" : "+"}</span>
                      </button>
                      {isOpen ? (
                        <div className="px-5 pb-5 text-sm leading-7 text-slate-600">
                          {item.answer}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-lg bg-brand-900 p-6 text-white">
          <p className="eyebrow text-brand-100">Need help?</p>
          <h2 className="mt-3 text-2xl font-black">Talk to the office team</h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            For current availability, document discussion, site visits, and owner coordination, contact the Pragnapur office.
          </p>
          <div className="mt-5 grid gap-3">
            <Link className="btn-primary bg-white text-brand-900 hover:bg-brand-50" to="/contact">
              Contact office
            </Link>
            <Link className="btn-secondary border-white/30 bg-transparent text-white hover:border-white hover:text-white" to="/properties">
              Browse listings
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
