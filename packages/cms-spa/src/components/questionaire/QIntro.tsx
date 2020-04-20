import React from "react";
import { Container } from "../Container";
import { Link } from "react-router-dom";
import { RouteNames } from "../../lib/common/enums";

export const QIntroNew: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <>
      <Container columnClassName="is-10">
        <h1 className="is-title is-1">Einleitung</h1>
        <div className="content">
          <p>
            <strong>
              Tool zur Anfangsbewertung von Standorten zur Einrichtung von
              Flussbadestellen
            </strong>
          </p>
          <p>Willkommen!</p>
          <p>
            Mit diesem Tool können Sie anhand von Fragen, die bei der
            Einrichtung einer neuen Flussbadestelle zu beachten sind, Ihren
            gewünschten Standort auf seine Eignung überprüfen. Hierzu werden Sie
            durch thematisch sortierte Multiple-Choice-Fragen geleitet.{" "}
          </p>
          <p>Auf Grundlage Ihrer Antworten erhalten Sie dann</p>
          <ul>
            <li>
              eine erste Einschätzung zur Umsetzungswahrscheinlichkeit Ihres
              Flussbadestellen-Vorhabens für den spezifischen Standort,
            </li>
            <li>Hintergrundinformationen und hilfreiche Links,</li>
            <li>
              Empfehlungen für wichtige nächste Schritte, um kritische Punkte zu
              klären.{" "}
            </li>
          </ul>
          <p>
            Einige Antwortoptionen enthalten sogenannte K.O.-Kriterien, die die
            Einrichtung einer Flussbadestelle am angegebenen Standort faktisch
            unmöglich machen. In diesem Fall wird ein Abbruch des Vorhabens
            empfohlen.
          </p>
          <p>
            Die Kriterien sind thematisch (Wasser- und Landseitig) sowie nach
            ihrer Relevanz geordnet, K.O.-Kriterien werden dabei jeweils zuerst
            abgefragt. Alle Kriterien sind nach dem Aufwand gegebenenfalls
            notwendiger Gegenmaßnahmen gewichtet. Diese Gewichtung fließt später
            in die Endbewertung ein.
          </p>
          <p>
            <strong>Empfehlungen für eine Ortsbegehung</strong>
          </p>
          <p>
            Sicherlich haben Sie, bevor Sie diese Anfangsbewertung für Ihr
            Vorhaben durchführen, den gewünschten Standort bereits besucht.
            Dennoch empfiehlt es sich vor der Beantwortung der Fragen noch
            einmal eine gezielte Ortsbegehung durchzuführen und auf relevante
            Punkte für die Durchführung der Standortprüfung zu achten.{" "}
          </p>
          <p>
            <a href="/ortsbegehung-leitfaden.pdf" target="_blank">
              Hier
            </a>{" "}
            finden Sie eine Liste von Punkten, auf die Sie mit Blick auf die
            spätere Standortbewertung im speziellen achten sollten, und mit
            denen Sie einige Fragen später leichter beantworten können.
          </p>
        </div>
      </Container>
      {isModal === undefined ||
        (isModal === false && (
          <Container columnClassName="is-8">
            <div className="buttons">
              <Link
                to={`/${RouteNames.questionnaire}/1`}
                className="button is-primary"
              >
                Standortbewertung beginnen!
              </Link>
            </div>
          </Container>
        ))}
    </>
  );
};
