import React from "react";
import { render, fireEvent } from "../../__test-utils/render-with-providers";
import { createMemoryHistory } from "history";
import { SpotEditorBasisData } from "../components/spot/SpotEditor-Basis-Data";
import { IBathingspot } from "../lib/common/interfaces";

/**
 * Suppress React 16.8 act() warnings globally.
 * The react teams fix won't be out of alpha until 16.9.0.
 */
// const consoleError = console.error;
beforeAll(() => {
  // jest.spyOn(console, 'error').mockImplementation((...args) => {
  //   if (
  //     !args[0].includes(
  //       'Warning: An update to %s inside a test was not wrapped in act',
  //     )
  //   ) {
  //     consoleError(...args);
  //   }
  // });
});

const handleEditModeClickMock = jest.fn(() => {
  // console.log('click');
});
it.skip("renders Spoteditor without crashing", () => {
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const spot: IBathingspot = {
    name: "Sweetwater",
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
  };

  const {
    getAllByLabelText,
    getAllByTestId,
    getByLabelText,
    getByTestId,
    debug,
  } = render(
    <SpotEditorBasisData
      handleInfoShowModeClick={() => {}}
      initialSpot={spot}
      handleEditModeClick={handleEditModeClickMock}
      newSpot={true}
    />,

    history,
  );
  debug();
  const input = getByTestId(/test-input-name/i);
  debug();
  fireEvent.change(input, { target: { value: "foo" } });
  expect(getAllByLabelText(/name/i)).toBeDefined();

  const buttons = getAllByTestId(/handle-edit-mode-button/i);
  buttons.forEach((ele) => {
    fireEvent.click(ele);
  });
  expect(handleEditModeClickMock).toHaveBeenCalled();
  expect(handleEditModeClickMock).toHaveBeenCalledTimes(2);
  // expect(editor.queryByText(/foo/i)).toBeDefined();
  // expect(editor.queryByText(/\*/i)).toBeDefined();

  // expect(editor.queryByText(/\<a/i)).toBeDefined();
});
