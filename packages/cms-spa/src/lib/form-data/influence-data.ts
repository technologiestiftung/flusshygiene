import { IFormOptions, IFormBuildData } from "../common/interfaces";

const optionsYNU: IFormOptions[] = [
  { text: "Ja", value: "yes" },
  { text: "Unbekannt", value: "unknown" },
  { text: "Nein", value: "no" },
];

export const influenceData: IFormBuildData[] = [
  {
    type: "select",
    name: "influencePurificationPlant",
    label: "kommunale Klärwerke",
    value: undefined,
    options: optionsYNU,
  },
  {
    type: "select",
    name: "influenceCombinedSewerSystem",
    label: "Mischwassereinleitungen aus urbanen Gebieten",
    value: undefined,
    options: optionsYNU,
  },
  {
    type: "select",

    name: "influenceRainwater",
    label: "Regenwassereileitung aus urbanen Gebieten",
    value: undefined,

    options: optionsYNU,
  },
  {
    type: "select",
    name: "influenceAgriculture",
    label: "Einleitungen aus der Landwirtschaft",
    value: undefined,
    options: optionsYNU,
  },
];
