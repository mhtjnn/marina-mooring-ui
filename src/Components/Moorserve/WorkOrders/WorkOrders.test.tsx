import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import WorkOrders from "../WorkOrders/workOrders";

describe("WorkOrder Components", () => {
  it("should render the text in the workOrdersComponents", () => {
    render(<WorkOrders />);
    const headerElement = screen.getByText("Work Orders");
    expect(headerElement).toBeInTheDocument();
  });

  it("should render the text in the  workOrdersComponents", () => {
    render(<WorkOrders />);
    const headerElement = screen.getByText("Create New");
    expect(headerElement).toBeInTheDocument();
  });

  it("should render the text in the workOrdersComponents", () => {
    render(<WorkOrders />);
    const headerElement = screen.getByText("MOORSERVE/Work Orders");
    expect(headerElement).toBeInTheDocument();
  });

  test("renders data correctly in DataTable", () => {
    render(<WorkOrders />);

    const boatData = [
      {
        id: "01",
        boatName: "Suncatcher",
        name: "John Smith",
        date: "15, March 2024 to 15, March 2024",
        measurement: "Length: 10m, Width: 3.8m",
        place: "Boatyard",
      },
      {
        id: "02",
        boatName: "Sunseeker",
        name: "Jane Doe",
        date: "16, March 2024 to 16, March 2024",
        measurement: "Length: 8m, Width: 3.5m",
        place: "Dock",
      },
    ];

    setTimeout(() => {
      boatData.forEach((row) => {
        Object.values(row).forEach((cellText) => {
          const cellElement = screen.getByText(cellText);
          expect(cellElement).toBeInTheDocument();
        });
      });
    }, 2000);
  });

  it("should render the inputComponets", () => {
    render(<WorkOrders />);
    const headerElement = screen.getByRole("textbox") as HTMLInputElement;
    expect(headerElement).toBeInTheDocument();
    fireEvent.change(headerElement, { target: { value: 'hello' } });
    expect(headerElement.value).toBe("hello");

  });



  test("renders search icon with correct class and color", () => {
    render(<WorkOrders />);

    const searchIcon = screen.getByTestId("search-icon");
    expect(searchIcon).toBeInTheDocument();

    expect(searchIcon).toHaveClass("pi", "pi-search");
  });





});
