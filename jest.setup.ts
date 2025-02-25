import "@testing-library/jest-dom";

// Cela permet de pouvoir tester ChartJS.
jest.mock("react-chartjs-2", () => ({ Bar: () => null, Doughnut: () => null }));
jest.mock("next/router", () => require("next-router-mock"));

// Cela permet de faire des mock sur les appels « fetch ».
// Sans ça, la methode fetch n’existe pas dans global et ne peut donc pas être mock
// @ts-ignore
global.fetch = () => { };
