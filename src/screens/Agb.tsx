"use client";

import LegalLayout, { LegalSection, Placeholder } from "@/components/LegalLayout";

export default function Agb() {
  return (
    <LegalLayout title="Allgemeine Geschäftsbedingungen" updated="8 July 2026">
      <LegalSection title="1. Geltungsbereich">
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen von Speisen und Getränken, die über die
          Website kokoland.de (Lieferung oder Abholung) bei Kokoland Gastro UG (haftungsbeschränkt)
          {" "}(&quot;kokoland&quot;, &quot;wir&quot;) aufgegeben werden.
        </p>
      </LegalSection>

      <LegalSection title="2. Vertragsschluss">
        <p>
          Die Darstellung der Speisen im Online-Shop stellt kein bindendes Angebot dar, sondern eine Aufforderung zur
          Bestellung. Mit Klick auf den Button &quot;Zahlungspflichtig bestellen&quot; geben Sie ein verbindliches
          Angebot zum Abschluss eines Kaufvertrags ab. Der Vertrag kommt zustande, sobald wir Ihre Bestellung
          elektronisch bestätigen (Bestellbestätigung per E-Mail oder auf der Website).
        </p>
      </LegalSection>

      <LegalSection title="3. Preise und Zahlung">
        <p>
          Alle angegebenen Preise sind Endpreise in Euro inklusive der gesetzlichen Mehrwertsteuer. Bei Lieferung
          fällt zusätzlich die auf der Website angezeigte Liefergebühr an, abhängig von Ihrer Postleitzahl. Die
          Zahlung erfolgt im Restaurant bzw. bei Abholung (bar oder per Karte) oder, wo angeboten, online per Kredit- oder Debitkarte, Apple Pay oder Google Pay über unseren Zahlungsdienstleister Stripe. Bei Online-Zahlung wird der Betrag mit Abschluss der Bestellung belastet.
        </p>
      </LegalSection>

      <LegalSection title="4. Lieferung und Abholung">
        <p>
          Wir liefern nur an Postleitzahlen innerhalb unseres definierten Liefergebiets; die verfügbaren Postleitzahlen,
          Mindestbestellwerte und Liefergebühren werden Ihnen vor Abschluss der Bestellung angezeigt. Angegebene
          Lieferzeiten sind Richtwerte und keine verbindlichen Termine, sofern nicht ausdrücklich anders vereinbart.
        </p>
      </LegalSection>

      <LegalSection title="5. Widerrufsrecht">
        <p>
          Da es sich bei den von uns angebotenen Speisen und Getränken um Waren handelt, die schnell verderben können
          oder deren Verfallsdatum schnell überschritten würde, ist das gesetzliche Widerrufsrecht gemäß § 312g Abs. 2
          Nr. 2 BGB ausgeschlossen. Ein Widerruf der Bestellung nach Vertragsschluss ist daher nicht möglich.
        </p>

      </LegalSection>

      <LegalSection title="5a. Vorbestellung und Tischreservierung">
        <p>
          Bei einer Vorbestellung mit gewünschter Uhrzeit (Abholung oder Essen vor Ort) bereiten wir die Speisen passend
          zu diesem Zeitpunkt zu. Bitte sagen Sie Änderungen oder eine Absage spätestens 2 Stunden vorher telefonisch ab
          (+49 176 24404981). Bei späterer Absage oder Nichterscheinen können bereits zubereitete Speisen nicht erstattet
          werden. Tischreservierungen ohne Vorbestellung sind kostenlos.
        </p>
      </LegalSection>

      <LegalSection title="6. Treueprogramm">
        <p>
          Im Rahmen unseres Treueprogramms erhalten registrierte Kund:innen Punkte für Bestellungen, die gegen
          Prämien eingelöst werden können. Punkte haben keinen Bargeldwert, sind nicht übertragbar und verfallen
          gemäß den auf der Website angezeigten Bedingungen.
        </p>
      </LegalSection>

      <LegalSection title="7. Haftung">
        <p>
          Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach Maßgabe des Produkthaftungsgesetzes.
          Für leichte Fahrlässigkeit haften wir nur bei Verletzung einer wesentlichen Vertragspflicht, begrenzt auf
          den vertragstypisch vorhersehbaren Schaden. Im Übrigen ist die Haftung ausgeschlossen.
        </p>
      </LegalSection>

      <LegalSection title="8. Schlussbestimmungen">
        <p>
          Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Sollten einzelne Bestimmungen dieser AGB
          unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Hinweis zur
          Online-Streitbeilegung und Verbraucherschlichtung siehe Impressum.
        </p>
      </LegalSection>

      <hr className="border-cream/10" />

      <LegalSection title="In English (informal summary)">
        <p>
          These terms govern orders placed through kokoland&apos;s website. Prices include German VAT; delivery fees
          depend on postcode. Because kokoland sells freshly prepared, perishable food, German law exempts these
          orders from the usual 14-day right of withdrawal (§312g Abs. 2 Nr. 2 BGB) — once you place an order, it
          can&apos;t be cancelled the way a regular online purchase could. Loyalty points have no cash value and aren&apos;t
          transferable. Fields marked in red still need kokoland&apos;s confirmed business details before this page is final.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
