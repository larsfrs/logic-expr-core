import { describe, expect, it } from 'vitest';
import { LeafNode } from '../../src/expressionTree/expressionTree.js';
import { NaryOperatorNode } from '../../src/expressionTree/naryTree.js';
import { dominantLaw } from '../../src/laws/dominantLaw.js';

type dominatLawArgs = [string, LeafNode];

describe('test dominant law transformations', () => {

    const inputData = [
        {
            description: 'A*0',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('0')
                ],
                '*'),
            funcArgs: ['*', new LeafNode('0')] as dominatLawArgs,
            expected: new LeafNode('0'),
            
        },
        {
            description: 'A+B+C+1',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new LeafNode('B'),
                    new LeafNode('C'),
                    new LeafNode('1')
                ], '+'
            ),
            funcArgs: ['+', new LeafNode('1')] as dominatLawArgs,
            expected: new LeafNode('1')
        },
        {
            description: 'A*(B+C+1)*C',
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C'),
                            new LeafNode('1')
                        ], '+'
                    ),
                    new LeafNode('C')
                ], '+'
            ),
            funcArgs: ['+', new LeafNode('1')] as dominatLawArgs,
            expected: new LeafNode('1')
        }
    ]

    it.each(inputData)('should apply dominant law to $description',
        ({input, funcArgs, expected}) => {
            const result = dominantLaw(input, ...funcArgs);
            expect(result).toEqual(expected);
    });
});
