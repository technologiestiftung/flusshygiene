import React from "react";
import { Table, TableBody, TableRowWithUrl } from "./Spot-Table";
import { REACT_APP_API_HOST } from "../../../lib/config";
import { APIMountPoints, ApiResources } from "../../../lib/common/enums";
import {
  RequestResourceTypes,
  IGenericInput,
  IPurificationPlant,
} from "../../../lib/common/interfaces";

interface ITableContent {
  title: string;
  resource: RequestResourceTypes;
  url: string;
}

const tableContent: ITableContent[] = [
  { title: "Badestelle", url: "", resource: "bathingspots" },
  {
    title: "Vorhersage",
    resource: "predictions",
    url: "",
  },
  { title: "Modelle", resource: "models", url: "" },
  { title: "Regenradar", resource: "rains", url: "" },
  { title: "Mikrobiologie", resource: "measurements", url: "" },
  { title: "Durchfluss", resource: "discharges", url: "" },
  { title: "Globalstrahlung", resource: "globalIrradiances", url: "" },
];
const BASE_URL = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/public/${ApiResources.bathingspots}`;
export const PublicData: React.FC<{
  spotId: number;
  genericInputs?: IGenericInput[];
  purificationPlants?: IPurificationPlant[];
}> = ({ spotId, genericInputs, purificationPlants }) => {
  const data = tableContent.map((elem) => {
    switch (elem.resource) {
      case "bathingspots": {
        elem.url = `${BASE_URL}/${spotId}`;
        break;
      }
      default: {
        elem.url = `${BASE_URL}/${spotId}/${elem.resource}`;
        break;
      }
    }
    return elem;
  });
  if (genericInputs) {
    const gis = genericInputs.map((gi) => {
      const item: ITableContent = {
        title: gi.name,
        url: `${BASE_URL}/${spotId}/${ApiResources.genericInputs}/${gi.id}/${ApiResources.measurements}`,
        resource: "genericInputs",
      };
      return item;
    });
    data.push(...gis);
  }
  if (purificationPlants) {
    const pps = purificationPlants.map((pp) => {
      const item: ITableContent = {
        title: pp.name,
        url: `${BASE_URL}/${spotId}/${ApiResources.purificationPlants}/${pp.id}/${ApiResources.measurements}`,
        resource: "purificationPlants",
      };
      return item;
    });
    data.push(...pps);
  }
  return (
    <>
      <Table>
        <TableBody>
          {data.map((elem, i) => (
            <TableRowWithUrl
              key={i}
              th={elem.title}
              url={elem.url}
              content={elem.url}
            ></TableRowWithUrl>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
