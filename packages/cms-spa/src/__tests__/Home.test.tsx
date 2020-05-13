import React from "react";
import Home from "../components/Home";
import { render } from "../../__test-utils/render-with-providers";
import { createMemoryHistory } from "history";

it.skip("renders Home without crashing", () => {
  const history = createMemoryHistory({ initialEntries: ["/"] });
  render(<Home />, undefined, history);
});
