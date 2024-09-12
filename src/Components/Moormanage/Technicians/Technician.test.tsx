import { render, screen } from "@testing-library/react";
import Technicians from "./Technicians";
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

describe("Technician Components", () => {
  it("renders Customer component correctly", () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>
    );
    expect(screen.getByText("MOORMANAGE/Technicians")).toBeInTheDocument();
  });

  it("should render the text in the TechnicianPage", () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>
    );
    expect(screen.getByText("Filter order by Date")).toBeInTheDocument();
  });


  it("renders BiCalendarAlt components ", () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>
    );
    const timeline2 = screen.getByTestId("BiCalendarAlt");

    expect(timeline2).toBeInTheDocument();
  });

  test("renders headers correctly in Technician DataTable", () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>
    );

    const headers = [
      "ID:",
      "Technician Name",
      "Open Work Orders",
      "Completed Jobs",
    ];

    headers.forEach((headerText) => {
      const headerElement = screen.getByText(headerText);
      expect(headerElement).toBeInTheDocument();
    });
  });




});



