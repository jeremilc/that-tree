import { normalizeNode, normalizeNodes, updateNode} from './utils';
import {Map} from "immutable";
import {INormalizedImmutableNode, NormalizedImmutableNode} from "./types";


describe('Node Utils', () => {
    describe('normalizeNode', () => {
        it('should return array containing given node with its path', () => {
            const node = { path: 'myNodePath' }
            const result = normalizeNode('', node);

            expect(result).toEqual([{ path: 'myNodePath', nodes: []}]);
        });

        it('should add given path to resulting path node', () => {
            const node = { path: 'myNodePath' }
            const result = normalizeNode('myCurrentPath', node);

            expect(result[0].path).toEqual('myCurrentPath/myNodePath' );
        });

        it('should include given node nodes in array', () => {
            const node = { path: 'myNodePath', nodes: [{ path: 'firstChildren' }, { path: 'secondChildren' }] }
            const result = normalizeNode('', node);

            expect(result).toEqual([
                { path: 'myNodePath', nodes: ['firstChildren', 'secondChildren'] },
                { path: 'myNodePath/firstChildren', nodes: []},
                { path: 'myNodePath/secondChildren', nodes: []},
            ]);
        });

        it('should normalize deeply nested node', () => {
            const node = {
                path: 'myNodePath',
                nodes: [
                    {
                        path: 'node1',
                        nodes: [
                            {
                                path: 'node1.1',
                                nodes: [
                                    {
                                        path: 'node1.1.1'
                                    },
                                    {
                                        path: 'node1.1.2'
                                    },
                                    {
                                        path: 'node1.1.3',
                                        nodes: [
                                            {
                                                path: 'node1.1.3.1'
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                path: 'node1.2',
                            },
                        ]
                    },
                    {
                        path: 'node2',
                    },
                    {
                        path: 'node3',
                        nodes: [
                            {
                                path: 'node3.1'
                            },
                            {
                                path: 'node3.2'
                            },
                            {
                                path: 'node3.3'
                            },
                        ]
                    },
                ]
            }
            const result = normalizeNode('', node);

            expect(result).toEqual([
                { path: 'myNodePath', nodes: ['node1', 'node2', 'node3'] },
                { path: 'myNodePath/node1', nodes: ['node1.1', 'node1.2']},
                { path: 'myNodePath/node1/node1.1', nodes: ['node1.1.1', 'node1.1.2', 'node1.1.3']},
                { path: 'myNodePath/node1/node1.1/node1.1.1', nodes: []},
                { path: 'myNodePath/node1/node1.1/node1.1.2', nodes: []},
                { path: 'myNodePath/node1/node1.1/node1.1.3', nodes: ['node1.1.3.1']},
                { path: 'myNodePath/node1/node1.1/node1.1.3/node1.1.3.1', nodes: []},
                { path: 'myNodePath/node1/node1.2', nodes: []},
                { path: 'myNodePath/node2', nodes: []},
                { path: 'myNodePath/node3', nodes: ['node3.1', 'node3.2', 'node3.3']},
                { path: 'myNodePath/node3/node3.1', nodes: []},
                { path: 'myNodePath/node3/node3.2', nodes: []},
                { path: 'myNodePath/node3/node3.3', nodes: []},
            ]);
        });
    });

    describe('normalizeNodes', () => {
        it('should return array containing all given node normalized', () => {
            const firstNode = { path: 'myFirstNode', nodes: [{ path: 'firstChildren' }, { path: 'secondChildren' }] };
            const secondNode = { path: 'mySecondNode', nodes: [{ path: 'thirdChildren' }, { path: 'fourthChildren' }] };
            const result = normalizeNodes([firstNode, secondNode]);

            expect(result).toEqual([
                { path: 'myFirstNode', nodes: ['firstChildren', 'secondChildren'] },
                { path: 'myFirstNode/firstChildren', nodes: []},
                { path: 'myFirstNode/secondChildren', nodes: []},
                { path: 'mySecondNode', nodes: ['thirdChildren', 'fourthChildren'] },
                { path: 'mySecondNode/thirdChildren', nodes: []},
                { path: 'mySecondNode/fourthChildren', nodes: []},
            ]);
        });
    });


    describe('updateNode', () => {
        it('should mutating state with given node', () => {
            const node = { path: 'myNodePath' }
            const result = Map<string, INormalizedImmutableNode>().withMutations(mutatingState => {
                updateNode(mutatingState, node, '');
            });

            expect(result.get('myNodePath')).toEqual(new NormalizedImmutableNode({}));
        });

        it('should add given path to resulting node', () => {
            const node = { path: 'myNodePath' }
            const result = Map<string, INormalizedImmutableNode>().withMutations(mutatingState => {
                updateNode(mutatingState, node, 'myCurrentPath');
            });

            expect(result.get('myCurrentPath/myNodePath')).toEqual(new NormalizedImmutableNode({}));
        });

        it('should remove nodes from mutating state when missing from the given node nodes', () => {
            const mockState = Map<string, INormalizedImmutableNode>({
                myNodePath: new NormalizedImmutableNode({ nodes: ['firstChildren'] }),
                ['myNodePath/firstChildren']: new NormalizedImmutableNode({ nodes: [] }),
            });

            const node = { path: 'myNodePath' }
            const result = mockState.withMutations(mutatingState => {
                updateNode(mutatingState, node, '');
            });

            expect(result.toJS()).toEqual({
                myNodePath: { nodes: [] }
            });
        })

        it('should add nodes in state from the given node nodes when node is missing', () => {
            const node = { path: 'myNodePath', nodes: [{ path: 'firstChildren'}]};
            const result = Map<string, INormalizedImmutableNode>().withMutations(mutatingState => {
                updateNode(mutatingState, node, '');
            });

            expect(result.toJS()).toEqual({
                myNodePath: { nodes: ['firstChildren'] },
                ['myNodePath/firstChildren']: { nodes: [] },
            });
        });

        it('should update nodes in state from the given node nodes', () => {
            const mockState = Map<string, INormalizedImmutableNode>({
                myNodePath: new NormalizedImmutableNode({ nodes: ['firstChildren'] }),
                ['myNodePath/firstChildren']: new NormalizedImmutableNode({ nodes: ['current'] }),
                ['myNodePath/firstChildren/current']: new NormalizedImmutableNode({ nodes: [] }),
            });

            const node = { path: 'myNodePath', nodes: [{ path: 'firstChildren', nodes: [{ path: 'updated' }]}]};
            const result = mockState.withMutations(mutatingState => {
                updateNode(mutatingState, node, '');
            });

            expect(result.toJS()).toEqual({
                myNodePath: { nodes: ['firstChildren'] },
                ['myNodePath/firstChildren']: { nodes: ['updated'] },
                ['myNodePath/firstChildren/updated']: { nodes: [] },
            });
        });

        it('should update deeply nested node', () => {
            const mockState = Map<string, INormalizedImmutableNode>({
                myNodePath: new NormalizedImmutableNode({ nodes: ['child1', 'child2', 'child3'] }),
                ['myNodePath/child1']: new NormalizedImmutableNode({ nodes: ['child1.1'] }),
                ['myNodePath/child1/child1.1']: new NormalizedImmutableNode({ nodes: [] }),
                ['myNodePath/child2']: new NormalizedImmutableNode({ nodes: ['child2.1'] }),
                ['myNodePath/child2/child2.1']: new NormalizedImmutableNode({ nodes: ['child2.1.1'] }),
                ['myNodePath/child2/child2.1/child2.1.1']: new NormalizedImmutableNode({ nodes: [] }),
                ['myNodePath/child3']: new NormalizedImmutableNode({ nodes: ['child3.1', 'child3.2'] }),
                ['myNodePath/child3/child3.1']: new NormalizedImmutableNode({ nodes: ['child3.1.1'] }),
                ['myNodePath/child3/child3.1/child3.1.1']: new NormalizedImmutableNode({ nodes: [''] }),
                ['myNodePath/child3/child3.2']: new NormalizedImmutableNode({ nodes: [''] }),
            });

            const node = {
                path: 'myNodePath',
                nodes: [
                    {
                        path: 'child1'
                    },
                    {
                        path: 'child3',
                        nodes: [
                            {
                                path: 'child3.1',
                            },
                            {
                                path: 'child3.3',
                            },
                        ]
                    },
                    {
                        path: 'child4',
                        nodes: [
                            {
                                path: 'child4.1',
                            },
                        ]
                    }
                ]
            };
            const result = mockState.withMutations(mutatingState => {
                updateNode(mutatingState, node, '');
            });

            expect(result.toJS()).toEqual({
                myNodePath: { nodes: ['child1', 'child3', 'child4'] },
                ['myNodePath/child1']: { nodes: [] },
                ['myNodePath/child3']: { nodes: ['child3.1', 'child3.3'] },
                ['myNodePath/child3/child3.1']: { nodes: [] },
                ['myNodePath/child3/child3.3']: { nodes: [] },
                ['myNodePath/child4']: { nodes: ['child4.1'] },
                ['myNodePath/child4/child4.1']: { nodes: [] },
            });

        })
    })
})

