"use client";

import Link from "next/link";
import LegalLayout, { LegalSection, Placeholder } from "@/components/LegalLayout";
import { useCookieConsent } from "@/context/CookieConsentContext";

export default function Datenschutz() {
  const { openSettings } = useCookieConsent();

  return (
    <LegalLayout title="Datenschutzerklärung" updated="8 July 2026">
      <LegalSection title="1. Verantwortlicher">
        <p>
          Verantwortlicher im Sinne der DSGVO ist:
          <br />
          <Placeholder>[Firmenname wie im Impressum]</Placeholder>, <Placeholder>[Anschrift]</Placeholder>
          <br />
          E-Mail: <Placeholder>[Datenschutz-E-Mail, z. B. privacy@kokoland.berlin]</Placeholder>
        </p>
      </LegalSection>

      <LegalSection title="2. Welche Daten wir verarbeiten">
        <p><strong>Beim Besuch der Website:</strong> technische Zugriffsdaten (IP-Adresse, Browsertyp, Zeitpunkt) durch unseren Hosting-Anbieter <Placeholder>[Hosting-Anbieter, z. B. Vercel Inc.]</Placeholder>, ausschließlich zur Bereitstellung der Website und Absicherung gegen Missbrauch.</p>
        <p><strong>Bei Kontoerstellung / Login:</strong> E-Mail-Adresse und Passwort (verschlüsselt gespeichert), verwaltet über unseren Authentifizierungs-Anbieter Supabase.</p>
        <p><strong>Bei Bestellungen:</strong> Name, E-Mail-Adresse, ggf. Liefer­adresse und Postleitzahl, Bestellinhalt, Zahlungsstatus. Diese Daten werden an unser Restaurant-Verwaltungssystem übermittelt, um die Bestellung zuzubereiten und auszuliefern.</p>
        <p><strong>Treueprogramm:</strong> E-Mail-Adresse, Punktestand und Bestellhistorie, sofern Sie sich für das Treueprogramm anmelden.</p>
        <p><strong>Zahlungsabwicklung:</strong> Sobald Online-Zahlungen aktiv sind, werden Zahlungsdaten direkt von unserem Zahlungsdienstleister Stripe verarbeitet — wir selbst sehen und speichern keine vollständigen Kartendaten.</p>
        <p><strong>Cookies:</strong> siehe Abschnitt 5.</p>
      </LegalSection>

      <LegalSection title="3. Rechtsgrundlagen">
        <p>
          Die Verarbeitung erfolgt zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO — Bestellungen, Konto), auf Grundlage
          Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO — Treueprogramm, nicht-notwendige Cookies) oder aufgrund
          berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO — Betrieb und Absicherung der Website).
        </p>
      </LegalSection>

      <LegalSection title="4. Empfänger / Auftragsverarbeiter">
        <p>Wir setzen folgende Dienstleister ein, mit denen jeweils Auftragsverarbeitungsverträge (Art. 28 DSGVO) bestehen bzw. bestehen werden:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Supabase Inc. — Datenbank, Authentifizierung. Serverstandort: <Placeholder>[Region bestätigen, z. B. EU-Frankfurt]</Placeholder></li>
          <li><Placeholder>[Hosting-Anbieter]</Placeholder> — Auslieferung der Website</li>
          <li>Stripe — Zahlungsabwicklung (sobald aktiv)</li>
        </ul>
        <p className="text-cream/65 text-xs">
          Bei Übermittlung in Drittländer (außerhalb der EU/des EWR) stützen wir uns auf Standardvertragsklauseln der EU-Kommission.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <p>
          Wir verwenden notwendige Cookies für Warenkorb, Login und Spracheinstellung sowie — nur mit Ihrer Einwilligung —
          Analyse- und Marketing-Cookies. Ihre aktuelle Auswahl können Sie jederzeit anpassen:
        </p>
        <button onClick={openSettings} className="text-lime underline underline-offset-2 hover:text-chili transition-colors">
          Cookie-Einstellungen öffnen
        </button>
      </LegalSection>

      <LegalSection title="6. Speicherdauer">
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist oder
          gesetzliche Aufbewahrungspflichten (z. B. handels- und steuerrechtlich, i. d. R. 6–10 Jahre für
          Rechnungsdaten) bestehen. <Placeholder>[Konkrete Löschfristen pro Datenkategorie ergänzen]</Placeholder>
        </p>
      </LegalSection>

      <LegalSection title="7. Ihre Rechte">
        <p>Sie haben das Recht auf:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft</li>
          <li>Beschwerde bei einer Datenschutzaufsichtsbehörde, z. B. der Berliner Beauftragten für Datenschutz und Informationsfreiheit</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Kontakt">
        <p>
          Für Anfragen zum Datenschutz wenden Sie sich an <Placeholder>[Datenschutz-E-Mail]</Placeholder>. Weitere
          Informationen zum Betreiber finden Sie im <Link href="/impressum" className="text-lime underline underline-offset-2">Impressum</Link>.
        </p>
      </LegalSection>

      <hr className="border-cream/10" />

      <LegalSection title="In English (informal summary)">
        <p>
          This privacy policy explains what personal data kokoland collects (account, orders, loyalty program, cookies),
          why, and who processes it on our behalf (Supabase for hosting/auth/database, Stripe for payments once online
          payments launch). You have the standard GDPR rights — access, correction, deletion, portability, objection,
          and complaint to a supervisory authority. Fields marked in red still need kokoland&apos;s confirmed business
          details before this page is final.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
