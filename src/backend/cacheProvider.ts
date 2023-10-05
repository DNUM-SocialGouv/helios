import NodeCache from "node-cache";

const appCache = new NodeCache({ checkperiod: 24 * 60 * 60 });


export default appCache;