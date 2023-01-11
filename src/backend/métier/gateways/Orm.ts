import { EnvironmentVariables } from "./EnvironmentVariables";

export type Orm<T> = (environmentVariables: EnvironmentVariables) => Promise<T>;
