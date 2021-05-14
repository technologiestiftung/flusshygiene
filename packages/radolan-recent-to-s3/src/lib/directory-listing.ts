/* eslint-disable no-console */
import { parseDocument, DomUtils } from "htmlparser2";
import fetch from "node-fetch";

export async function getDirectoryListingLinks({
  baseUrl,
}: {
  baseUrl: string;
}): Promise<string[]> {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error("Could not get dir listing");
  }
  if (response.status !== 200) {
    throw new Error("Status is not 200");
  }
  const html = await response.text(); //?
  const dom = parseDocument(html);

  const aElements = DomUtils.findAll(elem => {
    if (elem.name === "a" && elem.attribs.href.startsWith("raa01-sf_10000")) {
      return true;
    }
    return false;
  }, dom.childNodes);

  const links = aElements.map(elem => `${elem.attribs.href}`);
  return links;
}

if (require.main === module) {
  console.log("called directly");
  getDirectoryListingLinks({
    baseUrl:
      "https://opendata.dwd.de/climate_environment/CDC/grids_germany/daily/radolan/recent/bin/",
  }).catch(console.error);
}
