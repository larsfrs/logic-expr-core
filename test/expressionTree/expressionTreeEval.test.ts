import { expect, it, describe } from 'vitest';
import { ExpressionNode } from '../../src/expressionTree/expressionTree.js';
import { parseToTree } from '../../src/index.js';


describe('test expression tree eval', () => {

    const startingInputs = [
        {
            expression: "ab(c+aa)",
            args: { "a": true, "b": true, "c": true },
            result: true
        },
        {
            expression: "a'b'c'",
            args: { "a": false, "b": false, "c": false },
            result: true
        },
        {
            expression: "ab''c'aa(c+a)",
            args: { "a": true, "b": false, "c": true },
            result: false
        },
        {
            expression: "a",
            args: { "a": false , "b": true, "c": true },
            result: false
        },
        {
            expression: "a(b+c'(a+b'))",
            args: { "a": true , "b": false, "c": false },
            result: true
        }
    ];

    it.each(startingInputs)('eval each starting input',
        ({expression, args, result}) => {
            const tree: ExpressionNode = parseToTree(expression);
            expect(tree.evaluate(args)).toBe(result);
        }
    );
});
