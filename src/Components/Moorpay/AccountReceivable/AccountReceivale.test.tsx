import { render, screen } from "@testing-library/react";
import AccountRecievable from "./AccountRecievable";
import React from "react";

describe("AccountPayable component", () => {
  it("renders Account Payable header", () => {
    render(<AccountRecievable />);
    const headerElement = screen.getByText(/DownLoad Excel/i);
    expect(headerElement).toBeInTheDocument();
  });

  it("should render the text in the AccountRecievableComponents", () => {
    render(<AccountRecievable />);
    const headerElement = screen.getByText("Account Recievable");
    expect(headerElement).toBeInTheDocument();
  });

  it("should render the text in the AccountRecievableComponents", () => {
    render(<AccountRecievable />);
    const headerElement = screen.getByText("View All");
    expect(headerElement).toBeInTheDocument();
  });

  it("should render the text in the AccountRecievableComponents", () => {
    render(<AccountRecievable />);
    const headerElement = screen.getByText("Moormanage/Account Receivable");
    expect(headerElement).toBeInTheDocument();
  });

  test("renders headers correctly in DataTable", () => {
    render(<AccountRecievable />);

    const headers = [
      "invoice",
      "Mooring ID",
      "Customer Name",
      "Technician name",
      "Services",
      "Time",
      "Amount",
      "Actions",
    ];

    headers.forEach((headerText) => {
      const headerElement = screen.getByText(headerText);
      expect(headerElement).toBeInTheDocument();
    });
  });

  test("renders data correctly in DataTable", () => {
    render(<AccountRecievable />);

    const boatData = [
      {
        invoice: "#425",
        mooringid: "#6658",
        name: "John Smith",
        technicianName: "jim Carry",
        services: "Regular Services",
        time: "2hrs",
        amount: "$12",
      },
      {
        invoice: "#426",
        mooringid: "#6659",
        name: "Jane Doe",
        technicianName: "jimmy Carry",
        services: "Premium Services",
        time: "1hr",
        amount: "$15",
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
});
