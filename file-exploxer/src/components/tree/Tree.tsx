import React from "react";
import {selectRootNodes} from "../rootNode";
import {Node} from "../node";
import {useAppSelector} from "../../app/hooks";

export const Tree = () => {
    const nodes = useAppSelector(selectRootNodes);
    if (nodes.count() === 0){
        return <div>No root nodes</div>
    }
    return <>{nodes.map(node => <Node key={node} path={node} rootNode />)}</>;
}
