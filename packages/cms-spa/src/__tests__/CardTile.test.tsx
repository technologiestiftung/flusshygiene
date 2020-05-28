import React from "react";
import { render } from "../../__test-utils/render-with-providers";
import { createMemoryHistory } from "history";
import { CardTile } from "../components/spot/elements/Spot-CardTile";

it("renders The Card without crashing", () => {
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const card = render(
    <CardTile
      spot={{
        id: 1,
        name: "foo",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
      }}
      title={"Foo"}
      id={1}
      water={undefined}
      image={"http://placekitten.com/200/300"}
      hasPrediction={true}
    />,
    undefined,
    history,
  );
  expect(card.queryByText(/foo/i)).toBeDefined();
  expect(card.queryByText(/\*/i)).toBeDefined();

  expect(card.queryByText(/\<a/i)).toBeDefined();
});
