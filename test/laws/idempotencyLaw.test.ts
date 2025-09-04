import { describe, expect, it } from 'vitest';
import { LeafNode } from '../../src/expressionTree/expressionTree.js';
import { NaryOperatorNode } from '../../src/expressionTree/naryTree.js';
import { idempotencyLaw } from '../../src/laws/idempotencyLaw.js';

describe('test idempotency law transformations', () => {

    const inputData = [
        {
            description: 'A+A',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('A'),
                ],
                '+'),
            expected: new LeafNode('A')
        },
        {
            description: 'A*A',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('A'),
                ],
                '*'),
            expected: new LeafNode('A')
        },
        {
            description: 'A+B+A',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('B'),
                    new LeafNode('A'),
                ],
                '+'),
            expected: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('B'),
                ],
                '+')
        },
        {
            description: 'A*B*A',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('B'),
                    new LeafNode('A'),
                ],
                '*'),
            expected: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('B'),
                ],
                '*')
        },
        {
            description: 'A+B+C+A',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('B'),
                    new LeafNode('C'),
                    new LeafNode('A'),
                ],
                '+'),
            expected: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('B'),
                    new LeafNode('C'),
                ],
                '+')
        },
        {
            description: 'A(A+BC+BC)',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('B'),
                                    new LeafNode('C'),
                                ],
                                '*'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('B'),
                                    new LeafNode('C'),
                                ],
                                '*'),
                        ],
                        '+'),
                ],
                '*'),
            expected: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('B'),
                                    new LeafNode('C'),
                                ],
                                '*'),
                        ],
                        '+'),
                ],
                '*')
        }
    ]

    it.each(inputData)('should apply idempotency law to $description',
        ({input, expected}) => {
            const result = idempotencyLaw(input);
            expect(result).toEqual(expected);
    });
});