import { expect, describe, it } from 'vitest';
import { LeafNode, UnaryOperatorNode } from '../../src/expressionTree/expressionTree.js';
import { deMorgan } from "../../src/laws/deMorganLaw";
import { NaryOperatorNode } from '../../src/expressionTree/naryTree.js';

type deMorganLawArgs = [string, string, string];

describe('test deMorgan law transformations', () => {

    const inputData = [
        {
            description: 'A*!(B+C)',
            input: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new UnaryOperatorNode(
                        new NaryOperatorNode(
                            [
                                new LeafNode('B'),
                                new LeafNode('C'),
                            ],
                            '+'
                        ),
                        '!'
                    )
                ],
                '*'),
            funcArgs: ['!', '*', '+'] as deMorganLawArgs,
            expected: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new UnaryOperatorNode(new LeafNode('B'), '!'),
                    new UnaryOperatorNode(new LeafNode('C'), '!'),
                ],
                '*')
        },
        {
            description: '!(A*B)',
            input: new UnaryOperatorNode(
                new NaryOperatorNode(
                    [
                        new LeafNode('A'),
                        new LeafNode('B'),
                    ],
                    '*'
                ),
                '!'),
            funcArgs: ['!', '*', '+'] as deMorganLawArgs,
            expected: new NaryOperatorNode(
                [
                    new UnaryOperatorNode(new LeafNode('A'), '!'),
                    new UnaryOperatorNode(new LeafNode('B'), '!'),
                ],
                '+')
        },
        {
            description: '!(A*B*C)',
            input: new UnaryOperatorNode(
                new NaryOperatorNode(
                    [
                        new LeafNode('A'),
                        new LeafNode('B'),
                        new LeafNode('C'),
                    ],
                    '*'
                ),
                '!'),
            funcArgs: ['!', '*', '+'] as deMorganLawArgs,
            expected: new NaryOperatorNode(
                [
                    new UnaryOperatorNode(new LeafNode('A'), '!'),
                    new UnaryOperatorNode(new LeafNode('B'), '!'),
                    new UnaryOperatorNode(new LeafNode('C'), '!'),
                ],
                '+')
        }, 
        {
            description: '!(A+!(B+C)+C)', // !A*(B+C)*!C
            input: new UnaryOperatorNode(
                new NaryOperatorNode(
                    [
                        new LeafNode('A'),
                        new UnaryOperatorNode(
                            new NaryOperatorNode(
                                [
                                    new LeafNode('B'),
                                    new LeafNode('C'),
                                ],
                                '+'
                            ),
                            '!'
                        ),
                        new LeafNode('C'),
                    ],
                    '+'
                ),
                '!'),
            funcArgs: ['!', '*', '+'] as deMorganLawArgs,
            expected: new NaryOperatorNode(
                [
                    new UnaryOperatorNode(new LeafNode('A'), '!'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                        '+'
                    ),
                    new UnaryOperatorNode(new LeafNode('C'), '!'),
                ],
                '*')
        },
    ]

    it.each(inputData)('should apply deMorgan law to $description',
        ({input, expected, funcArgs}) => {
            const result = deMorgan(input, ...funcArgs);
            expect(result).toEqual(expected);
    });
});