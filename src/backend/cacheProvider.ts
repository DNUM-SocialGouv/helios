import NodeCache from "node-cache";

const myCache = new NodeCache({ checkperiod: 24 * 60 * 60 });


export default myCache;