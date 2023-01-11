import "@testing-library/jest-dom/extend-expect";

// Cela permet de pouvoir tester ChartJS.
jest.mock("react-chartjs-2", () => ({ Bar: () => null, Doughnut: () => null }));
