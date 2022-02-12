import {RootState} from "../../app/store";
import {RootNodeState} from "./types";

export const selectRootNodes = (state: RootState): RootNodeState => state.rootNodes;
