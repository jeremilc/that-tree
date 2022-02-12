import {ActionType, LoadRootNode} from "./types";
import {INode} from "../node";

export function loadRootNodes(nodes: INode[]): LoadRootNode {
    return {
        type: ActionType.loadRootNode,
        nodes,
    };
}
