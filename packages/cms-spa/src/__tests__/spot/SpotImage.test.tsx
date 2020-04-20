import React from "react";
import { render } from "../../../__test-utils/render-with-providers";
import { SpotImage } from "../../components/spot/elements/Spot-Image";

describe("Testing spot image", () => {
  test("should render the image component without crashing", () => {
    const { getByAltText, container, getByText, getByTitle } = render(
      <SpotImage
        image={"http://placekitten.com/1080/540"}
        nameLong={"Fooo"}
        name={"foo"}
      />,
    );
    expect(getByAltText(/fooo/i)).toBeTruthy();
    expect(container.getElementsByTagName("figcaption")).toBeTruthy();
    expect(getByText(/unbekannt/i)).toBeTruthy();
    expect(getByTitle(/foo/i)).toBeTruthy();
  });

  test("should replace null image value with placekitten", () => {
    const { container } = render(
      <SpotImage name={"n"} nameLong={"nn"} image={null}></SpotImage>,
    );
    expect(container.querySelector("img")!.src).toContain("placeholder");
  });
});
