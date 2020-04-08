import React from "react";
import { storiesOf } from "@storybook/react";
// import { action } from '@storybook/addon-actions';
import { CardTile } from "../components/spot/elements/Spot-CardTile";
import { MemoryRouter } from "react-router";

storiesOf("CardTile", module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
  ))
  .add("default", () => (
    <CardTile
      title={"Sweetwater"}
      water={"Sweet"}
      spot={{
        isPublic: true,
        name: "foo",
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }}
      id={1}
      image={"/placeholder2-1.svg"}
      hasPrediction={true}
    />
  ));
