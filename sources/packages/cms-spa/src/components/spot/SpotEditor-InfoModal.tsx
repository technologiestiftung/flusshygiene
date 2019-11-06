import React from 'react';

export const SpotEditorInfoModal: React.FC<{
  isActive: boolean;
  clickHandler: () => void;
}> = ({ isActive, clickHandler }) => {
  return (
    <div className={`modal ${isActive === true ? 'is-active' : ''}`}>
      <div className='modal-background' onClick={clickHandler}></div>
      <div className='modal-content'>
        <div className='box'>
          <div className='content'>
            <h1>Informationen zum Anlegen von Badestellen</h1>
            <p>
              Liebe Nutzer*innen, dieses Tool soll die Nutzer*innen dabei
              unterstützen, vorhersagebasierte Einschätzungen der
              Badegewässerqualität vorzunehmen, soweit sich diese mit frei
              verfügbaren oder vom Nutzer bereitgestellten Datensätzen
              vorhersagen lässt. Wichtig ist, dass es sich bei diesen
              Datensätzen um solche handelt, die kontinuierlich gemessen werden
              und automatisch abfragbar sind. Die Daten der wichtigsten
              Vorhersagevariable, des Regens, kann das aufgebaute Tool
              selbstständig über das Angebot des Deutschen Wetterdienstes
              beziehen. Hier ist kein User-Input notwendig.
            </p>
            <p>
              Anzumerken ist, dass es sich bei diesem Tool um ein Expertentool
              handelt. Es wird davon ausgegangen, dass grundsätzliche Kenntnisse
              und Begrifflichkeiten der Badegewässerbewirtschaftung und zu
              potentiellen Belastungsquellen vorausgesetzt werden. Unterstützt
              werden vor allem der Aufbau, die Bewertung und die Nutzung
              statistischer Modelle zur Vorhersage der Badegewässerqualität.
              Dennoch wird versucht die Nutzung so einfach wie möglich zu
              gestalten.
            </p>
            <p>
              Das Minimum an Information, das{' '}
              <span style={{ textDecoration: 'underline' }}>
                von den Nutzer*innen{' '}
              </span>
              bereitgestellt werden muss, ist:
            </p>
            <ol>
              <li>
                Der Name und Ort der Badestelle (als Längen und Breitengrad,
                Koordinatensystem WGS84)
              </li>
              <li>
                Datum und Messwerte der Badegewässerüberwachung (optional kann
                zusätzlich der Zeitpunkt der Probennahme angegeben werden)
              </li>
              <li>
                Die Definition einer Niederschlagsfläche, von der davon
                ausgegangen wird, dass der gefallene Regen die
                Badegewässerqualität negativ beeinflussen kann.
              </li>
            </ol>
            <p>
              Darüber hinaus werden Basisinformationen zu Charakteristiken, des
              Einzugsgebiets abgefragt. Falls diese Informationen nicht
              vorliegen können diese Information mit „unbekannt“ angegeben
              werden.
            </p>
            <h2>Dateineingabe</h2>
            <p>
              Die Dateneingabe muss über eine csv.-Datei erfolgen, dass wiederum
              einem bestimmten Format genügen muss, um von der Plattform
              eingelesen werden zu können. Innerhalb der Plattform werden die
              folgenden Trennzeichen verwendet:
            </p>

            <table className='table'>
              <tbody>
                <tr>
                  <td>Art des Trennzeichens</td>
                  <td>Zeichen </td>
                </tr>
                <tr>
                  <td>Dezimaltrennzeichen </td>
                  <td>Punkt </td>
                </tr>
                <tr>
                  <td>Spaltentrennzeichen</td>
                  <td>Komma</td>
                </tr>
              </tbody>
            </table>
            <p>
              Alle Spaltennamen und Werte müssen ohne Anführungszeichen
              angegeben werden. Die Datentabelle muss des Weiteren die folgenden
              Spalten enthalten:
            </p>
            <table className='table'>
              <thead>
                <tr>
                  <th>Spaltenname</th>
                  <th>Information</th>
                  <th>Format</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>date</td>
                  <td>Datum der Probenname </td>
                  <td>
                    YYYY-MM-DD HH:MM:SS (Beispiel: 2016-04-15 13:15:13 = 15.
                    April 2006 um 13 Uhr 15 und 15 Sekunden)
                  </td>
                </tr>
                <tr>
                  <td>conc_ec</td>
                  <td>Messwert von E.coli [MPN/100mL]</td>
                  <td>Ganze Zahlen, keine Dezimalstellen</td>
                </tr>
                <tr>
                  <td>conc_ie</td>
                  <td>Messwert von intestinalen Enterokokken[MPN/100mL]</td>
                  <td>Ganze Zahlen, keine Dezimalstellen</td>
                </tr>
              </tbody>
            </table>
            <h2>Definition der Niederschlagsfläche</h2>
            <p>
              Unter einer „relevanten Niederschlagsfläche“ wird die Grundfläche
              verstanden, über der der Regen eine bestimmte Badestelle
              beeinflusst. Dies bedeutet, dass Niederschläge, die über dieser
              Fläche fallen zu Einleitungen von hygienischen Belastungen führen,
              die letztendlich, das Badegewässer beeinflussen. Aufgrund der
              vielfältigen, verschiedenen Standortbedingungen ist es nicht
              möglich eine allgemeingültige Schätzung der für ein Badegewässer
              relevanten Regenfläche zu definieren. Von daher ist
              ortsspezifisches Wissen über den Standort des Badegewässers
              notwendig. Über eine interaktive Karte kann die relevante
              Regenfläche definiert werden. Es ist zu erwähnen, dass das Raster
              des Regenradars eine Auflösung von 1km x 1km hat. Diese Auflösung
              ist zwar bereits sehr hoch, jedoch können teilweise zu
              detaillierte Kurvenverläufe unter Umständen nicht perfekt
              abgebildet werden.
            </p>
            <p>
              Anbei einige Faktoren, die bei der Auswahl der Fläche bedacht
              werden sollten:
            </p>
            <ol>
              <li>
                An Flüssen sollte die Fließrichtung bedacht werden, da nur
                Einleitungen im Oberlauf die Badestelle beeinträchtigen.
              </li>
              <li>
                An Flüssen können auch Einleitungen die kilometerweit im
                Oberlauf der Badestelle liegen, die Badegewässerqualität negativ
                beeinflussen.
              </li>
              <li>
                Urbane Gebiete sollten als Ganzes mit einbezogen werden, da
                Niederschläge dort zu Einleitungen aus der Misch - und
                Trennkanalisation führen können.
              </li>
              <li>
                Informationen über das Relief können wichtig sein, für die
                Beeinflussung des Niederschlags zu bewerten.
              </li>
              <li>
                Einleitungen sind nicht nur aus urbanen sondern auch aus
                landwirtschaftlichen Flächen zu erwarten.
              </li>
            </ol>
            <p>
              Mit einem <strong>*</strong> gekennzeichnete Felder sind
              Pflichtfelder
            </p>
          </div>
        </div>
        <button
          className='modal-close is-large'
          aria-label='close'
          onClick={clickHandler}
        ></button>
      </div>
    </div>
  );
};
