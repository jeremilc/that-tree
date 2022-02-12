import {List} from "immutable";
import {INode} from "../node";

export enum ActionType {
    loadRootNode = 'loadRootNode',
}

export interface LoadRootNode {
    type: ActionType.loadRootNode;
    nodes: INode[];
}

export type RootNodeState = List<string>;
