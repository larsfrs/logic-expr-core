import { expect, test, beforeAll } from 'vitest';
import { distribute } from "../../src/transformations/distributiveLaw";
import { BinaryOperatorNode, ExpressionNode, LeafNode } from '../../src/expressionTree/expressionTree';

let inputTrees: ExpressionNode[] = [];
let expectedTress: ExpressionNode[] = [];

// all cases: (AND ommited, OR operator = +)
// 1. A(B+C) => AB + AC
// 2. (A+B)(C+D) => (A+B)C + (A+B)D =>
//    (AC + BC) + (A+B)D => (AC + BC) + (AD + BD) =>
//    (((AC + BC) + AD) + BD)
// 3. A((B+C)+C) => A(B+C) + AC => (AB + AC) + AC
// 4. A => A

beforeAll(() => {
    inputTrees = [
        new BinaryOperatorNode(
            new LeafNode('a'),
            new BinaryOperatorNode(
                new LeafNode('b'),
                new LeafNode('c'),
                '+'
            ),
            '*'
        ),

        new BinaryOperatorNode(
            new BinaryOperatorNode(
                new LeafNode('a'),
                new LeafNode('b'),
                '+'
            ),
            new BinaryOperatorNode(
                new LeafNode('c'),
                new LeafNode('d'),
                '+'
            ),
            '*'
        ),

        new BinaryOperatorNode(
            new LeafNode('a'),
            new BinaryOperatorNode(
                new BinaryOperatorNode(
                    new LeafNode('b'),
                    new LeafNode('c'),
                    '+'
                ),
                new LeafNode('c'),
                '+'
            ),
            '*'
        ),
        new LeafNode('a')
    ];

    expectedTress = [
        new BinaryOperatorNode(
            new BinaryOperatorNode(
                new LeafNode('a'),
                new LeafNode('b'),
                '*'
            ),
            new BinaryOperatorNode(
                new LeafNode('a'),
                new LeafNode('c'),
                '*'
            ),
            '+'
        ),

        new BinaryOperatorNode(
            new BinaryOperatorNode(
                new BinaryOperatorNode(
                    new BinaryOperatorNode(
                        new LeafNode('a'),
                        new LeafNode('c'),
                        '*'
                    ),
                    new BinaryOperatorNode(
                        new LeafNode('a'),
                        new LeafNode('d'),
                        '*'
                    ),
                    '+'
                ),
                new BinaryOperatorNode(
                    new LeafNode('b'),
                    new LeafNode('c'),
                    '*'
                ),
                '+'
            ),
            new BinaryOperatorNode(
                new LeafNode('b'),
                new LeafNode('d'),
                '*'
            ),
            '+'
        ),

        new BinaryOperatorNode(
            new BinaryOperatorNode(
                new BinaryOperatorNode(
                    new LeafNode('a'),
                    new LeafNode('b'),
                    '*'
                ),
                new BinaryOperatorNode(
                    new LeafNode('a'),
                    new LeafNode('c'),
                    '*'
                ),
                '+'
            ),
            new BinaryOperatorNode(
                new LeafNode('a'),
                new LeafNode('c'),
                '*'
            ),
            '+'
        ),
        new LeafNode('a')
    ];   
});

test('test distributive law transformation', () => {
    inputTrees.forEach((inputTree, index) => {
        const result = distribute(inputTree, '*', '+');
        expect(result.toString()).toBe(expectedTress[index].toString());
    });
});
