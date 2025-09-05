import { describe, expect, it } from 'vitest';
import { LeafNode } from '../../src/expressionTree/expressionTree.js';
import { NaryOperatorNode } from '../../src/expressionTree/naryTree.js';
import { identityLaw } from '../../src/laws/identityLaw.js';

type identityLawArgs = [string, LeafNode];

describe('test id law transformations', () => {

    const inputData = [
        {
            description: 'A+0',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('0')
                ],
                '+'),
            funcArgs: ['+', new LeafNode('0')] as identityLawArgs,
            expected: new LeafNode('A')
        },
        {
            description: 'A+B+C+0',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('B'),
                    new LeafNode('C'),
                    new LeafNode('0')
                ], '+'
            ),
            funcArgs: ['+', new LeafNode('0')] as identityLawArgs,
            expected:new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('B'),
                    new LeafNode('C')
                ], '+'
            ), 
        }
    ]

    it.each(inputData)('should apply id law to $description',
        ({input, expected, funcArgs}) => {
            const result = identityLaw(input, ...funcArgs);
            expect(result).toEqual(expected);
    });
});
