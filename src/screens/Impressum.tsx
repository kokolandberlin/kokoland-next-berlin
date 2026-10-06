"use client";

import LegalLayout, { LegalSection, Placeholder } from "@/components/LegalLayout";

export default function Impressum() {
  return (
    <LegalLayout title="Impressum" updated="4 October 2026">
      <LegalSection title="Angaben gemäß § 5 DDG">
        <p>
          Kokoland Gastro UG (haftungsbeschränkt)
          <br />
          Petersburger Str. 39
          <br />
          10249 Berlin, Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Vertreten durch">
        <p>
          Geschäftsführer:
          <br />
          Sony Thellappilly Skariah
          <br />
          Abhishek Mavingal
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          Telefon: +49 176 24404981
          <br />
          E-Mail: info@kokolandberlin.com
        </p>
      </LegalSection>

      <LegalSection title="Registereintrag">
        <p>
          Eintragung im Handelsregister.
          <br />
          Registergericht: Amtsgericht Charlottenburg (Berlin)
          <br />
          Registernummer: HRB 261554 B
        </p>
      </LegalSection>

      <LegalSection title="Umsatzsteuer-ID">
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          <br />
          DE368507346
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>
          Sony Thellappilly Skariah, Kokoland Gastro UG (haftungsbeschränkt), Anschrift wie oben
        </p>
      </LegalSection>

      <LegalSection title="EU-Streitschlichtung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime underline underline-offset-2"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . Unsere E-Mail-Adresse finden Sie oben unter Kontakt.
        </p>
      </LegalSection>

      <LegalSection title="Verbraucherstreitbeilegung">
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.{" "}
          <span className="text-cream/65 text-xs">
            (Anpassen, falls eine freiwillige Teilnahme gewünscht ist.)
          </span>
        </p>
      </LegalSection>

      <hr className="border-cream/10" />

      <LegalSection title="In English (informal summary)">
        <p>
          This is the legal notice (&quot;Impressum&quot;) required for commercial websites under German law (§5 DDG). It
          identifies the operator of this website, their contact details, and the trade register/VAT information
          where applicable. The fields above marked in red still need to be filled in with kokoland&apos;s real business
          details before this page goes live.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
