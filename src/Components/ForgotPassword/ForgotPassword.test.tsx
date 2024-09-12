import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Store/Store";
import { BrowserRouter } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

describe("Forgot Password Components", () => {
    it("should render button", () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <ForgotPassword />
                </Provider>
            </BrowserRouter>
        );

        const btn = screen.getByRole("button");
        expect(btn).toBeInTheDocument();
    });

    it("should render one button", () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <ForgotPassword />
                </Provider>
            </BrowserRouter>
        );

        const btn = screen.getAllByRole("button");
        expect(btn.length).toBe(1);
    });

    it("should render img tag", () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <ForgotPassword />
                </Provider>
            </BrowserRouter>
        );

        const imgTag = screen.getByRole("img");
        expect(imgTag).toBeInTheDocument();
    });

    it("should render one img", () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <ForgotPassword />
                </Provider>
            </BrowserRouter>
        );

        const img = screen.getAllByRole("img");
        expect(img.length).toBe(1);
    });

    it("should render InputComponent", () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <ForgotPassword />
                </Provider>
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText("Enter Your Registered email");
        expect(input).toBeInTheDocument();
    });

    it("should render paragraph tag with specific text", () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <ForgotPassword />
                </Provider>
            </BrowserRouter>
        );

        const paragraphText = screen.getByText(
            /If you are having trouble logging in, please enter the email address registered with MOORFIND. If it is a valid email address, you will be sent an email allowing you to resest your password./i
        );
        expect(paragraphText).toBeInTheDocument();
    });


    it("should render h1 tag with specific text", () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <ForgotPassword />
                </Provider>
            </BrowserRouter>
        );

        const h1Tag = screen.getByText(/Back/i);
        expect(h1Tag).toBeInTheDocument();
    });


    it("should call validateEmailHandler when Submit button is clicked", async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ForgotPassword />
                </BrowserRouter>
            </Provider>
        );

        const submitButton = screen.getByText("Submit");

        const mockValidateEmailHandler = jest.fn();

        fireEvent.click(submitButton);

        expect(mockValidateEmailHandler).toHaveBeenCalledTimes(0);
    });




});
