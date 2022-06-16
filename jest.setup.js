import '@testing-library/jest-dom/extend-expect'

// Pour ChartJS
jest.mock('react-chartjs-2', () => ({ Bar: () => null }))
