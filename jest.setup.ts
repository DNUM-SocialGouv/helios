import "@testing-library/jest-dom";

// Cela permet de pouvoir tester ChartJS.
jest.mock("react-chartjs-2", () => ({ Bar: () => null, Doughnut: () => null }));
jest.mock("next/router", () => require("next-router-mock"));
