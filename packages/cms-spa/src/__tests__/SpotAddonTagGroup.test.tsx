import React from "react";
import { render } from "../../__test-utils/render-with-providers";
import { SpotBodyAddonTagGroup } from "../components/spot/elements/Spot-AddonTag-Group";

describe("SpotAddontags", () => {
  test("Should render with yes and no", () => {
    const { getAllByText, getByText } = render(
      <SpotBodyAddonTagGroup
        cyanoPossible={true}
        lifeguard={true}
        disabilityAccess={true}
        hasDisabilityAccesableEntrence={true}
        restaurant={true}
        snack={true}
        parkingSpots={true}
        bathrooms={true}
        disabilityAccessBathrooms={true}
        bathroomsMobile={true}
        dogban={true}
      />,
    );
    expect(getByText(/cyanobakterien möglich/i)).toBeTruthy();
    expect(getByText(/rettungschwimmer/i)).toBeTruthy();
    expect(getAllByText(/barrierefrei.* (eingang|waschräume)/i)).toBeTruthy();
    expect(getByText(/restaurant/i)).toBeTruthy();
    expect(getByText(/imbiss/i)).toBeTruthy();
    expect(getByText(/parkplätze/i)).toBeTruthy();
    expect(getAllByText(/(mobile|) waschräume/i)).toBeTruthy();
    expect(getByText(/hundeverbot/i)).toBeTruthy();
    expect(getAllByText(/ja/i)).toBeTruthy();
    expect(() => {
      getAllByText(/nein/i);
    }).toThrow();
  });
});
