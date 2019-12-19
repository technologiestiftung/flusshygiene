import React from 'react';
import { Container } from './Container';
import {
  REACT_APP_DOMAIN_URL,
  REACT_APP_DOMAIN_NICE_NAME,
} from '../lib/config';
type ImprintType = 'imprint' | 'privacy';
export const Imprint: React.FC<{ imprintType: ImprintType }> = ({
  imprintType: type,
}) => {
  return (
    <Container columnClassName='is-8'>
      <div className='content'>
        {type === 'imprint' && (
          <>
            <h1 className='is-title is-1'>IMPRESSUM</h1>
            <p>
              Impressum des Webauftritts{' '}
              <a href={REACT_APP_DOMAIN_URL}>{REACT_APP_DOMAIN_NICE_NAME}</a>{' '}
              gemäß dem Gesetz über rechtliche Rahmenbedingungen für den
              elektronischen Geschäftsverkehr (EGG) und dem Teledienstgesetz
              (TDG).
            </p>
            <p>
              <strong>Kompetenzzentrum Wasser Berlin gGmbH</strong>
              <br />
              Cicerostr. 24
              <br />
              10709 Berlin
            </p>
            <p>
              Tel: +49 (0) 30 - 53 653 - 800
              <br />
              Fax: +49 (0) 30 - 53 653 - 888
              <br />
              E-Mail:{' '}
              <a href='mailto:info@kompetenz-wasser.de'>
                info@kompetenz-wasser.de
              </a>
              <br />
              Web:{' '}
              <a
                href='https://www.kompetenz-wasser.de'
                target='_blank'
                rel='noopener noreferrer'
              >
                www.kompetenz-wasser.de
              </a>
            </p>
            <p>
              Das Kompetenzzentrum Wasser Berlin ist eine gemeinnützige GmbH.
            </p>
            <p>
              <strong>Geschäftsführung: </strong>Edith Roßbach, Regina Gnirß
              <br />
              <strong>Prokura </strong>Dr. Bodo Weigert, Dr. Pascale Rouault,
              Dr. Ulf Miehe
              <br />
              <strong>Vorsitzender des Aufsichtsrats: </strong>Jörg Simon
            </p>
            <p>
              <strong>Bank: </strong>Commerzbank AG
              <br />
              <strong>Konto: </strong>4103933700
              <br />
              <strong>BLZ: </strong>120 800 00
              <br />
              <strong>IBAN:</strong> DE42 1208 0000 4103 9337 00
              <br />
              <strong>SWIFT-BIC:</strong> DRES DE FF 120
            </p>
            <p>
              <strong>Sitz der gGmbH: </strong>Berlin
              <br />
              <strong>Registergericht: </strong>Amtsgericht
              Berlin-Charlottenburg
              <br />
              <strong>Handelsregister-Nr.: </strong>HRB 84461
              <br />
              <strong>Umsatzsteuerident.-Nr.: </strong>DE 221139990
              <br />
              <strong>Steuer-Nr.: </strong>27/640/02526
            </p>
            <p>
              <strong>
                Inhaltlich Verantwortlich gemäß §5 TMG:
                <br />
              </strong>
              Dr. Bodo Weigert
            </p>
            <p>
              <strong>
                Webdesign
                <br />
              </strong>
              Technologiestiftung Berlin
            </p>
            <p>
              <strong>
                Webentwicklung
                <br />
              </strong>
              Technologiestiftung Berlin
            </p>
            <p>
              <strong>
                Haftungshinweis
                <br />
              </strong>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
              Haftung für die Inhalte und die Gestaltung externer Links. Für den
              Inhalt der verlinkten Seiten inkl. der Unterseiten sind
              ausschließlich deren Betreiber verantwortlich.
            </p>
            <p>
              Die Seiten unseres Internetauftritts dienen der Information. Alle
              Angaben wurden sehr sorgfältig recherchiert und zusammengestellt
              und werden ständig aktualisiert. Ungeachtet unseres eigenen
              Interesses an der Richtigkeit, Vollständigkeit und Aktualität der
              Inhalte können wir dafür leider keinerlei Haftung, weder
              ausdrücklich noch stillschweigend, übernehmen.
            </p>
            <p>
              Die Inhalte der Seiten dienen lediglich der allgemeinen
              Information. Aus diesem Grunde sind die Geltendmachung bzw. der
              Ersatz von Schäden, die aus dem Gebrauch der Internet-Seiten und
              der auf ihnen enthaltenen Informationen direkt oder indirekt
              resultieren, ausgeschlossen.
            </p>
            <p>
              Keine Abmahnung ohne vorherigen Kontakt! Sollte der Inhalt oder
              die Aufmachung dieser Seiten fremde Rechte Dritter oder
              gesetzliche Bestimmungen verletzen, so bitten wir um eine
              entsprechende Nachricht ohne Kostennote. Wir garantieren, dass die
              zu Recht beanstandeten Passagen unverzüglich entfernt werden, ohne
              dass von Ihrer Seite die Einschaltung eines Rechtsbeistandes
              erforderlich ist. Dennoch von Ihnen ohne vorherige Kontaktaufnahme
              ausgelöste Kosten werden wir vollumfänglich zurückweisen. Vielen
              Dank für Ihr Verständnis.
            </p>
            <p>
              Änderungen der Inhalte der Internet-Seiten bleiben jederzeit
              ausdrücklich vorbehalten.
            </p>
            <p>
              Inhalt und Gestaltung der Internet-Seiten sind urheberrechtlich
              geschützt. Eine Vervielfältigung der Seiten oder ihrer Inhalte
              bedarf der vorherigen schriftlichen Zustimmung der KWB gGmbH.
            </p>
            <p>
              <strong>
                Rechtliche Hinweise zum Urheberrecht
                <br />
              </strong>
              Das Layout der Website, die verwendeten Grafiken sowie die
              sonstigen Inhalte der Internetpräsenz{' '}
              <a href={REACT_APP_DOMAIN_URL}>
                {REACT_APP_DOMAIN_NICE_NAME}
              </a>{' '}
              sind urheberrechtlich geschützt. Alle Rechte vorbehalten.
            </p>
            <p>Bildrechte:</p>
            <p>XXXX</p>
          </>
        )}

        {type === 'privacy' && (
          <>
            <h1 className={'is-title is-1'}>DATENSCHUTZ</h1>

            <p>
              Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und
              behandeln Ihre personenbezogenen Daten vertraulich und
              entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser
              Datenschutzerklärung.
            </p>
            <p>
              <strong>Verarbeitung personenbezogener Daten</strong>
            </p>
            <p>
              Wir erheben und verarbeiten personenbezogene Daten nur, soweit
              diese für die Einladung zu Veranstaltungen der Kompetenzzentrum
              Wasser Berlin gGmbH (KWB), der allgemeinen Information über KWB
              und die Erstellung und den Versand von anlassbezogenen Schreiben
              des KWB erforderlich sind (Bestandsdaten). Sie können unsere Seite
              besuchen, ohne Angaben zu Ihrer Person zu machen. Personenbezogene
              Daten werden nur erhoben, wenn Sie uns diese im Rahmen Ihrer
              Veranstaltungsanmeldung oder Registrierung für unseren Newsletter
              freiwillig mitteilen.{' '}
            </p>
            <p>
              Weitere Hinweise nach Artikel 13/14 DSGVO zur Verarbeitung Ihrer
              personenbezogenen Daten finden Sie in unserer Erklärung zum
              Datenschutz.
            </p>
            <p>
              Datenschutzbeauftragter: Tobias Evel;
              datenschutz@kompetenz-wasser.de
            </p>
            <p>
              <strong>Ihre Rechte</strong>
            </p>
            <p>
              Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung,
              Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und
              Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer
              Daten gegen das Datenschutzrecht verstößt oder Ihre
              datenschutzrechtlichen Ansprüche in sonst einer Weise verletzt
              worden sind, können Sie sich bei der Aufsichtsbehörde beschweren.
              In Berlin ist dies der Berliner Beauftragte für Datenschutz und
              Informationsfreiheit. Bei Fragen zur Erhebung, Verarbeitung oder
              Nutzung Ihrer personenbezogenen Daten, bei Auskünften,
              Berichtigung, Sperrung oder Löschung von Daten sowie Widerruf
              erteilter Einwilligungen wenden Sie sich bitte an:
              datenschutz@kompetenz-wasser.de
            </p>
            <p>
              <strong>Kontakt mit uns</strong>
            </p>
            <p>
              Wenn Sie per Formular auf der Website oder per E-Mail-Kontakt mit
              uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung
              der Anfrage sowie in der gesetzlich vorgeschriebenen
              E-Mail-Archivierung erfasst. Diese Daten geben wir nicht ohne Ihre
              Einwilligung weiter.
            </p>
            <p>
              <strong>Ansprechpartner für Datenschutz</strong>
            </p>
            <p>
              Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer
              personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung
              oder Löschung von Daten sowie Widerruf erteilter Einwilligungen
              wenden Sie sich bitte an datenschutz@kompetenz-wasser.de.
            </p>
            <p>
              <strong>Datensicherheit</strong>
            </p>
            <p>
              Wir sichern unsere Website und sonstigen Systeme durch technische
              und organisatorische Maßnahmen gegen Verlust, Zerstörung, Zugriff,
              Veränderung oder Verbreitung Ihrer Daten durch unbefugte Personen.
              Alle Daten in unseren Anmelde- und Kontaktformularen verschlüsseln
              wir mit SSL. Unsere Sicherheitsmaßnahmen haben wir gemäß allgemein
              anerkannten Standards eingerichtet, damit die an uns übermittelten
              personenbezogenen Daten sowohl bei der Übertragung als auch nach
              Erhalt so gut wie möglich geschützt sind. Dennoch ist keine
              Übertragung über das Internet und keine Speichermethode
              hundertprozentig sicher.
            </p>
          </>
        )}
      </div>
    </Container>
  );
};
