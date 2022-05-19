import {typeOrmOrm} from "./infrastructure/gateways/orm/typeOrmOrm";

export function getOrm() {
    return typeOrmOrm(environmentVariables)
}