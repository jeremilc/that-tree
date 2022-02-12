import {List, Record, Map} from "immutable";

export interface INode {
    path: string,
    nodes?: INode[],
}

export interface INormalizedNode {
    path: string;
    nodes: string[],
}

export interface INormalizedImmutableNode {
    nodes: List<string>,
}

const normalizedImmutableNode = Record<INormalizedImmutableNode>({
    nodes: List<string>(),
});

export class NormalizedImmutableNode extends normalizedImmutableNode implements INormalizedImmutableNode {
    constructor({ nodes }: Partial<INormalizedNode>) {
        super({
            nodes: List(nodes),
        });
    }
}

export enum ActionType {
    updateNode = 'updateNode',
}

export interface UpdateNode {
    type: ActionType.updateNode;
    node: INode;
}

export type NodeState = Map<string, INormalizedImmutableNode>;
