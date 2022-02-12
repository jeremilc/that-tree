import {ActionType, UpdateNode, INode} from "./types";

export function updateNode(node: INode): UpdateNode {
    return {
        type: ActionType.updateNode,
        node,
    };
}
