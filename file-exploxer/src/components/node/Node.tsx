import styled from 'styled-components';
import {useAppSelector} from "../../app/hooks";
import {selectNodeById} from "./selectors";
import {useState} from "react";

const StyledButton = styled.button`  
    background: none!important;
    border: none;
    padding: 0!important;
    color: #069;
    text-decoration: underline;
    cursor: pointer;
`;

const StyledNodesContent = styled.div`  
    padding-left: 10px;
`;

export const Node = ({ path, rootNode }: {
    path: string,
    rootNode?: boolean
}) => {
    const node = useAppSelector(selectNodeById)(path);
    const [expanded, setExpanded] = useState(false);
    if (!node) {
        return <div>unknown {path}</div>
    }
    const hasNode = node.nodes.count() > 0;
    const nodeName = !rootNode && path.lastIndexOf('/') >= 0 ? path.substring(path.lastIndexOf('/') + 1) : path;
    return (
        <div>
            {hasNode ?
                (
                    <StyledButton onClick={() => setExpanded(!expanded)}>
                        {nodeName}
                    </StyledButton>
                ) :
                nodeName
            }

            {expanded && hasNode && (
            <StyledNodesContent>
                {node.nodes.map(child => (
                    <Node key={child} path={`${path}/${child}`} />
                ))}
            </StyledNodesContent>
            )}
        </div>
    );
}

