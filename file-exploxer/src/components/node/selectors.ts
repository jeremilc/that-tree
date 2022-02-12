import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {NodeState} from "./types";

export const selectNodes = (state: RootState): NodeState => state.nodes;
export const selectNodeById = createSelector(selectNodes, nodes => (id: string) => nodes.has(id) ? nodes.get(id) : null);
