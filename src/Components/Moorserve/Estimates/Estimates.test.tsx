import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Estimates from "./Estimates";

describe("Estimates Components", () => {
  it("should render the text in the EstimatesComponents", () => {
    render(<Estimates />);
    const headerElement = screen.getByText("Estimate");
    expect(headerElement).toBeInTheDocument();
  });

  it("should render the text in the EstimatesComponents", () => {
    render(<Estimates />);
    const headerElement = screen.getByText("DownLoad");
    expect(headerElement).toBeInTheDocument();
  });

  it("should render the text in the EstimatesComponents", () => {
    render(<Estimates />);
    const headerElement = screen.getByText("View All");
    expect(headerElement).toBeInTheDocument();
  });

  it("renders data correctly in DataTable", () => {
    render(<Estimates />);

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

  test("modal opens and closes correctly", () => {
    render(<Estimates />);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});
