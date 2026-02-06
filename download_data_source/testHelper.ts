
import { Logger } from "./métier/gateways/Logger";

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};
