declare module "graphology-layout-forceatlas2" {
  import Graph from "graphology-types";

  export interface Settings {
    linLogMode: boolean;
    outboundAttractionDistribution: boolean;
    adjustSizes: boolean;
    edgeWeightInfluence: number;
    scalingRatio: number;
    strongGravityMode: boolean;
    gravity: number;
    slowDown: number;
    barnesHutOptimize: boolean;
    barnesHutTheta: number;
  }

  // tslint:disable-next-line:class-name
  interface IForceAtlas2 {
    (graph: Graph, iterationOrSettings?: number | Settings): void;
    assign(graph: Graph, iterationOrSettings?: number | Settings): void;
    inferSettings(graph: Graph): Settings;
  }
  const forceAtlas2: IForceAtlas2;

  export default forceAtlas2;
}

declare module "graphology-layout-forceatlas2/worker" {
  import Graph from "graphology-types";
  import { Settings } from "graphology-layout-forceatlas2";

  export default class FA2LayoutSupervisor {
    constructor(graph: Graph, params?: any);

    start(setting: { settings?: Settings; [key: string]: any }): void;
    stop(): void;
    kill(): void;
  }
}
