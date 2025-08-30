import { describe, expect, it } from 'vitest';
import { BinaryOperatorNode, LeafNode } from '../../src/expressionTree/expressionTree';
import { NaryOperatorNode, binaryToNaryTree, NaryTreeToBinaryTree } from '../../src/expressionTree/naryTree';


describe('test N-ary tree transformations', () => {

    const inputData = [
        {
            input:  new BinaryOperatorNode(
                        new BinaryOperatorNode(
                            new BinaryOperatorNode(
                                new BinaryOperatorNode(
                                    new BinaryOperatorNode(
                                        new LeafNode('a'),
                                        new LeafNode('b'),
                                        '+'
                                    ),
                                    new LeafNode('c'),
                                    '+'
                                ),
                                new LeafNode('d'),
                                '+'
                            ),
                            new LeafNode('e'),
                            '+'
                        ),
                        new BinaryOperatorNode(
                            new LeafNode('a'),
                            new LeafNode('e'),
                            '*'
                        ),
                        '+'
                    ),
            expected:   new NaryOperatorNode(
                            [
                                new LeafNode('a'),
                                new LeafNode('b'),
                                new LeafNode('c'),
                                new LeafNode('d'),
                                new LeafNode('e'),
                                new NaryOperatorNode(
                                    [
                                        new LeafNode('a'),
                                        new LeafNode('e')
                                    ],
                                    '*'
                                )
                            ],
                            '+'
                        ),
            description: 'A+B+C+D+AE'
        },
        {
            input: new BinaryOperatorNode(
                        new LeafNode('a'),
                        new BinaryOperatorNode(
                            new BinaryOperatorNode(
                                new LeafNode('b'),
                                new LeafNode('c'),
                                '+'
                            ),
                            new LeafNode('d'),
                            '+'
                        ),
                        '*'
                    ),
            expected: new NaryOperatorNode(
                        [
                            new LeafNode('a'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('b'),
                                    new LeafNode('c'),
                                    new LeafNode('d')
                                ],
                                '+'
                            )
                        ],
                        '*'
                    ),
            description: 'A(B+C+D)'
        },
        {
            input: new BinaryOperatorNode(
                        new LeafNode('a'),
                        new LeafNode('b'),
                        '+'
                    ),
            expected: new NaryOperatorNode(
                        [
                            new LeafNode('a'),
                            new LeafNode('b')
                        ],
                        '+'
                    ),
            description: 'A+B'
        },
        /*{
            ToDo  
            description: 'A(B+C+DEGF)'
        },*/
    ]

    it.each(inputData)('should convert binary tree $description to N-ary tree',
        ({input, expected}) => {
            const result = binaryToNaryTree(input);
            expect(result).toEqual(expected);
    });

    it.each(inputData)('should convert N-ary tree $description to binary tree',
        ({input, expected}) => {
            const result = NaryTreeToBinaryTree(expected);
            expect(result).toEqual(input);
    });

});