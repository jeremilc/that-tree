import {INode, INormalizedNode, NodeState, NormalizedImmutableNode} from "./types";

function getPath(parentPath: string, path: string) {
    return `${parentPath}${parentPath && '/'}${path}`;
}

export function createNormalizedNode(path: string, { nodes }: INode): INormalizedNode {
    return {
        path,
        nodes: (nodes || []).map(childNode => childNode.path),
    }
}

export function normalizeNode(path: string, node: INode): INormalizedNode[] {
    const currentPath = getPath(path, node.path);
    return (node.nodes || []).reduce(
        (result, childNode) => result.concat(normalizeNode(currentPath, childNode)),
        [createNormalizedNode(currentPath, node)]
    );
}

export function normalizeNodes(nodes: INode[]): INormalizedNode[] {
    return nodes.reduce((result, node) => {
        return [...result, ...normalizeNode('', node)]
    }, [] as INormalizedNode[])
}


export function updateNode(mutatingState: NodeState, node: INode, path: string) {
    const currentPath = getPath(path, node.path);
    const currentNode = mutatingState.get(currentPath);
    // remove nodes
    currentNode?.nodes.forEach((childNode) => {
        if (!node.nodes?.find((receivedNode) => receivedNode.path === childNode)) {
            removeNode(mutatingState, getPath(currentPath, childNode));
        }
    });
    // set node
    mutatingState.set(currentPath, new NormalizedImmutableNode(createNormalizedNode(currentPath, node)));
    node.nodes?.forEach((childNode) => {
        updateNode(mutatingState, childNode, currentPath)
    })
}

function removeNode(mutatingState: NodeState, nodePath: string) {
    if (mutatingState.has(nodePath)) {
        const node = mutatingState.get(nodePath);
        if (node) {
            node.nodes.forEach((childNodePath) => {
                removeNode(mutatingState, getPath(nodePath, childNodePath));
            })
        }
        mutatingState.remove(nodePath)
    }
}
