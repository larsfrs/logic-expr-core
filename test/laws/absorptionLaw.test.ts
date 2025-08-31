import { expect, describe, it } from 'vitest';
import { LeafNode } from '../../src/expressionTree/expressionTree.js';
import { absorptionLaw } from "../../src/laws/absorptionLaw.js";
import { NaryOperatorNode } from '../../src/expressionTree/naryTree.js';

type absorptionLawArgs = [string, string];

describe('test absorption law transformations', () => {

    const inputData = [
        {
            description: 'A + AB',
            input: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                        ],
                        '*'
                    )
                ],
                '+'),
            funcArgs: ['+', '*'] as absorptionLawArgs,
            expected: new LeafNode('A')
        },
        {
            description: 'A(A + B)',
            input: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                        ],
                        '+'
                    )
                ],
                '*'),
            funcArgs: ['*', '+'] as absorptionLawArgs,
            expected: new LeafNode('A')
        },
        {
            description: 'A + AB + AC',
            input: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                        ],
                        '*'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('C'),
                        ],
                        '*'
                    )
                ],
                '+'),
            funcArgs: ['+', '*'] as absorptionLawArgs,
            expected: new LeafNode('A')
        },
        {
            description: 'A(C+D) + AH(C+D)',
            input: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('C'),
                                    new LeafNode('D'),
                                ],
                                '+'
                            )
                        ],
                        '*'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('H'), // swapped on purpose to test canonical form
                            new NaryOperatorNode(
                                [
                                    new LeafNode('D'), // same here
                                    new LeafNode('C'),
                                ],
                                '+'
                            )
                        ],
                        '*'
                    )
                ],
                '+'),
            funcArgs: ['+', '*'] as absorptionLawArgs,
            expected: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('C'),
                            new LeafNode('D'),
                        ],
                        '+'
                    )
                ],
                '*'
            )
        },
        {
            description: 'A(B+C) + A(B+C+D)', // here it should not simplify, as neither is a subexpression of the other
            input: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('B'),
                                    new LeafNode('C'),
                                ],
                                '+'
                            )
                        ],
                        '*'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('B'),
                                    new LeafNode('C'),
                                    new LeafNode('D'),
                                ],
                                '+'
                            )
                        ],
                        '*'
                    )
                ],
                '+'),
            funcArgs: ['+', '*'] as absorptionLawArgs,
            expected: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('B'),
                                    new LeafNode('C'),
                                ],
                                '+'
                            )
                        ],
                        '*'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('B'),
                                    new LeafNode('C'),
                                    new LeafNode('D'),
                                ],
                                '+'
                            )
                        ],
                        '*'
                    )
                ],
                '+'),
        }
    ]

    it.each(inputData)('apply absorption law to $description',
        ({input, funcArgs, expected}) => {
            const result = absorptionLaw(input, ...funcArgs);
            expect(result).toEqual(expected);
    });
});