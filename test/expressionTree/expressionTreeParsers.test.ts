import { expect, test } from 'vitest';
import { ExpressionNode } from '../../src/expressionTree/expressionTree.js';
import { expressionToRPN, RPNToGraph } from '../../src/expressionTree/expressionTreeParsers.js';
import { booleanContext, mathContext } from '../../src/expressionTree/expressionTreeOperators.js';
import { globalInput, globalInputRPN, globalTrees } from './globalTestCases.js';


// shunting yard test with different (mathematical) operators
test('shunting-yard algorithm test', () => {
    const input: string = "6+4*2/(1+5+6)^4^7";
    const expectedOutput: string[] = ['6', '4', '2', '*', '1', '5', '+', '6', '+', '4', '7', '^', '^', '/', '+'];

    const output: string[] = expressionToRPN(
        input,
        mathContext,
        ['6', '4', '2', '1', '5', '6', '4', '7']
    );
    expect(output).toEqual(expectedOutput);
});

// full end-to-end parsing and printing test
test('shunting-yard algorithm test with full expression tree', () => {
    for (let i = 0; i < globalInput.length; i++) {
        const expectedExpr: string = globalInput[i];
        const expectedTree: ExpressionNode = globalTrees[i];
        const expectedRPN: string[] = globalInputRPN[i];

        const createdRPN: string[] = expressionToRPN(expectedExpr, booleanContext, ['a', 'b', 'c', 'd']);
        const createdTree: ExpressionNode = RPNToGraph(createdRPN, booleanContext);
        const createdExpr: string = createdTree.toString();

        // compare expr => RPN
        expect(createdRPN).toEqual(expectedRPN);

        // compare RPN => tree
        expect(createdTree.toString()).toBe(expectedTree.toString());

        // compare tree => expr
        expect(createdExpr).toBe(expectedExpr);
    }
});
