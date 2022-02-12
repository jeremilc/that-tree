import {Map} from "immutable";
import {normalizeNodes, updateNode} from "./utils";
import {
    ActionType as NodeActionType,
    INormalizedImmutableNode,
    NodeState,
    NormalizedImmutableNode,
    UpdateNode
} from "./types";
import {ActionType as RootNodeActionType, LoadRootNode} from "../rootNode/types";

export function reducer(state: NodeState = Map<string, INormalizedImmutableNode>(), action: UpdateNode | LoadRootNode): NodeState {
    switch(action.type) {
        case RootNodeActionType.loadRootNode:
            const normalizedNodes = normalizeNodes(action.nodes);
            return Map<string, INormalizedImmutableNode>().withMutations(newState => {
                normalizedNodes.forEach(({ path, nodes}) => {
                    newState.set(path, new NormalizedImmutableNode({ nodes }))
                })
            });
        case NodeActionType.updateNode:
            return state.withMutations(newState => {
                updateNode(newState, action.node, '');
            })

    }
    return state;
}



