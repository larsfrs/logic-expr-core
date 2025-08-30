import { describe, expect, it } from 'vitest';
import { LeafNode } from '../../src/expressionTree/expressionTree.js';
import { NaryOperatorNode } from '../../src/expressionTree/naryTree.js';
import { OperatorContext, booleanContext } from '../../src/expressionTree/expressionTreeOperators.js';
import { distributiveLaw } from '../../src/laws/distributiveLaw.js';

// all cases: (AND ommited, OR operator = +)
// 1. A(B+C) => AB + AC
// 2. (A+B)(C+D) => (A+B)C + (A+B)D =>
//    (AC + BC) + (A+B)D => (AC + BC) + (AD + BD) =>
//    (((AC + BC) + AD) + BD)
// 3. A((B+C)+C) => A(B+C) + AC => (AB + AC) + AC
// 4. A => A

type distributeLawArgs = [string, string];

describe('test distributive law transformations', () => {

    const inputData = [
        {
            description: 'A(B+C)',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C')
                        ], '+'
                    )
                ], '*'
            ),
            funcArgs: ['*', '+'] as distributeLawArgs,
            expected: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B')
                        ], '*'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('C')
                        ], '*'
                    )
                ], '+'
            )
        },
        {
            description: '(A+B)(C+D)',
            // (A+B)(C+D) => A(C+D) + B(C+D) => (AC + AD) + (BC + BD)
            // => AC + AD + BC + BD
            input:  new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B')
                        ], '+'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('C'),
                            new LeafNode('D')
                        ], '+'
                    )
                ], '*'
            ),
            funcArgs: ['*', '+'] as distributeLawArgs,
            expected: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('C')
                        ], '*'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('D')
                        ], '*'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C')
                        ], '*'
                    ),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('D')
                        ], '*'
                    )
                ], '+'
            )
        }
    ]

    it.each(inputData)('should apply distributive law to $description',
        ({input, funcArgs, expected}) => {
            const result = distributiveLaw(input, ...funcArgs);
            expect(result).toEqual(expected);
    });
});
