import {List} from "immutable";
import {ActionType, LoadRootNode, RootNodeState} from "./types";

export function reducer(state: RootNodeState = List<string>(), action: LoadRootNode): RootNodeState {
    switch(action.type) {
        case ActionType.loadRootNode:
            return List(action.nodes.map(node => node.path));
    }
    return state;
}
