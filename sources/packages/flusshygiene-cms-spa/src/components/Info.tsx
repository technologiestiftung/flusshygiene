import React from 'react';

// interface IInfo {
//   [key:string]: any;
// }
const Info: React.FC<{}> = () => {
  return (
    <div className='container info'>
      <div className='columns  is-centered'>
        <div className='column is-10'>
          <h1 className='title is-1'>Beschreibung Vorhersagemodell</h1>
          {/* tslint:disable-next-line: max-line-length */}
          <p>
            Die Badegewässerqualität wird regelmäßig durch das Landesamt für
            Gesundheit und Soziales überwacht und zeigt die gute Qualität in den
            Berliner Seen, die den Bürger zum Baden einlädt.
          </p>
          {/* tslint:disable-next-line: max-line-length */}
          <p>
            Einige Badestellen im nördlichen Bereich der Unterhavel
            (Grunewaldturm und Kleine Badewiese) werden, wenn es regnet, vom
            Berliner Stadtgebiet beeinflusst. Wie wir es von der
            Wettervorhersage kennen, regnet es örtlich und zeitlich sehr
            unterschiedlich. Auch die Fließgeschwindigkeit in Spree und Havel
            kann sich innerhalb kurzer Zeit stark verändern. Mit einer
            Verschlechterung der Badegewässerqualität ist dann zu rechnen, wenn
            es stark geregnet hat, es zu Einleitungen aus dem Stadtgebiet kommt,
            und die Fließgeschwindigkeit im Fluss hoch ist. Dieser Zusammenhang
            wurde im Forschungsprojekt FLUSSHYGIENE über zwei Jahre sehr genau
            untersucht und kann nun genutzt werden um die Badegewässerqualität
            vorherzusagen.
          </p>
          {/* tslint:disable-next-line: max-line-length */}
          <p>
            Zu diesem Zweck wurde aus den gewonnenen Messdaten ein statistisches
            Modell entwickelt, dass die Badegewässerqualität für jeden Tag
            bewertet. Durch sehr gute Ergebnisse während der
            FLUSSHYGIENE-Projektphase, wird das Modell nun für den dauerhaften
            Einsatz getestet. Hierfür übermitteln die Berliner Wasserbetriebe
            (BWB) jeden Tag die gemessenen Daten zu Regen, Mischwasserüberläufen
            aus der Kanalisation sowie die Zu- und Ablaufdaten vom Klärwerk
            Ruhleben. Die Senatsverwaltung für Umwelt, Verkehr und Klimaschutz
            (SenUVK) übermittelt die täglichen Daten über den gemessenen
            Durchfluss, also wie viel Wasser im Fluss pro Sekunde abfließt. Die
            Daten werden automatisch eingelesen, aufbereitet und mit Hilfe des
            statistischen Modells ausgewertet. Am Ende steht jeden Morgen eine
            Prognose über die Wasserqualität, die an diesem Tag zu erwarten ist.
          </p>
          <h2 className='title is-2'>Hinweise:</h2>
          {/* tslint:disable-next-line: max-line-length */}
          <p>
            Das Baden in natürlichen Gewässern ist nie zu 100% risikofrei. Auch
            der Schiffs- und Bootsverkehr in der Unterhavel kann zu Belastungen
            führen, die durch das Modell nicht vorhergesagt werden.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
