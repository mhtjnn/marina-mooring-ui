import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Moorings from "./Moorings";
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

describe("Moorings Component", () => {
  it("renders Moorings header", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );

    const headerElement = screen.getByText("Moormanage/Moorings");
    expect(headerElement).toBeInTheDocument();
  });

  it("renders Add New button", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );
    const addButton = screen.getByText("ADD NEW");
    expect(addButton).toBeInTheDocument();
  });

  it("renders DataTable headers with correct content", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );

    const headers = ["ID:", "Mooring Name", "GPS Coordinates"];

    headers.forEach((headerText) => {
      const headerElement = screen.getByText(headerText);
      expect(headerElement).toBeInTheDocument();
    });
  });

  test("renders Facircle components within specified structure", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );

    const Facircle11 = screen.getByTestId("Facircle1");
    const Facircle12 = screen.getByTestId("Facircle2");
    expect(Facircle11).toBeInTheDocument();
    expect(Facircle12).toBeInTheDocument();
  });

  it("renders Facircle components within specified structure", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );

    const Facircle11 = screen.getByTestId("Facircle3");
    const Facircle12 = screen.getByTestId("Facircle4");
    expect(Facircle11).toBeInTheDocument();
    expect(Facircle12).toBeInTheDocument();
  });

  it("renders Sea image with specified structure", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );

    const seaImage = screen.getByAltText("Sea");

    expect(seaImage).toBeInTheDocument();
    expect(seaImage).toHaveAttribute("src", "/assets/images/map.png");
    expect(seaImage).toHaveClass(
      "bg-no-repeat object-cover bg-auto rounded-md w-full h-[105vh]"
    );
  });

  it("should render the text in the MooringComponent", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );

    const para = screen.getByText("Not in Use");
    expect(para).toBeInTheDocument();
  });

  it("should render the text in the MooringComponent", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );

    const paragraph = screen.getByText("Gear On (in the water)");
    expect(paragraph).toBeInTheDocument();
  });

  it("should render the text in the MooringComponent", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );

    const paraTwo = screen.getByText("Gear Off (out of the water)");
    expect(paraTwo).toBeInTheDocument();
  });

  it("should render the text in the MooringComponent", () => {
    render(
      <Provider store={store}>
        <Moorings />
      </Provider>
    );

    const para = screen.getByText("Need inspection");
    expect(para).toBeInTheDocument();
  });

  describe("Accordion component in Moorings", () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <Moorings />
        </Provider>
      );
    });

    it('renders "Customers Record" and Edit button in the Accordion header', () => {
      const customersRecordText = screen.getByText("Customers Record");
      expect(customersRecordText).toBeInTheDocument();

      const editButton = screen.getByTestId("edit");
      expect(editButton).toBeInTheDocument();
    });

    it("toggles Accordion content visibility on InputSwitch change", () => {
      const inputSwitch = screen.getByRole("checkbox");
      expect(inputSwitch).toBeInTheDocument();
    });

    it("renders Moorings DataTable when InputSwitch is checked", () => {
      const mooringsDataTable = screen.getByRole("table");
      expect(mooringsDataTable).toBeInTheDocument();
    });
  });
});
