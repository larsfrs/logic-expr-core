import { describe, expect, it } from 'vitest';
import { LeafNode, UnaryOperatorNode } from '../../src/expressionTree/expressionTree.js';
import { NaryOperatorNode } from '../../src/expressionTree/naryTree.js';
import { complementLaw } from '../../src/laws/complementLaw.js';

type complementLawArgs = [string, string, LeafNode];

describe('test complement law transformations', () => {

    const inputData = [
        {
            description: 'A + !A',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new UnaryOperatorNode(new LeafNode('A'), '!')
                ],
                '+'),
            funcArgs: ['+', '!', new LeafNode('1')] as complementLawArgs,
            expected: new LeafNode('1')
        },
        {
            description: 'A * (A * !A)', // A * ( 0 ) = A * 0
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new UnaryOperatorNode(new LeafNode('A'), '!')
                        ],
                        '*')
                ],
                '*'),
            funcArgs: ['*', '!', new LeafNode('0')] as complementLawArgs,
            expected: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('0')
                ],
                '*')
        },
        {
            description: 'A(B+C) + !(A(C+B))',
            input: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('B'),
                                    new LeafNode('C')
                                ],
                                '+'
                            )
                        ],
                        '*'
                    ),
                    new UnaryOperatorNode(
                        new NaryOperatorNode(
                            [
                                new LeafNode('A'),
                                new NaryOperatorNode(
                                    [
                                        new LeafNode('C'),
                                        new LeafNode('B')
                                    ],
                                    '+'
                                )
                            ],
                            '*'
                        ),
                        '!'
                    )
                ],
                '+'
            ),
            funcArgs: ['+', '!', new LeafNode('1')] as complementLawArgs,
            expected: new LeafNode('1')
        },
        {
            description: '!(BC) + (BC) + C!B',
            input: new NaryOperatorNode(
                [
                    new UnaryOperatorNode(
                        new NaryOperatorNode(
                            [
                                new LeafNode('B'),
                                new LeafNode('C')
                            ],
                            '*'
                        ),
                        '!'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C')
                        ],
                        '*'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('C'),
                            new UnaryOperatorNode(new LeafNode('B'), '!')
                        ],
                        '*'
                    )
                ],
                '+'
            ),
            funcArgs: ['+', '!', new LeafNode('1')] as complementLawArgs,
            expected: new NaryOperatorNode(
                [
                    new LeafNode('1'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('C'),
                            new UnaryOperatorNode(new LeafNode('B'), '!')
                        ],
                        '*'
                    )
                ],
                '+'
            )
        }
    ]

    it.each(inputData)('apply complement law to $description',
        ({input, funcArgs, expected}) => {
            const result = complementLaw(input, ...funcArgs);
            expect(result).toEqual(expected);
    });
});
