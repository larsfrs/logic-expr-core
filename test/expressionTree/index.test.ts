import { expect, test } from 'vitest';
import { ExpressionNode } from '../../src/expressionTree/expressionTree.js';
import { booleanContext } from '../../src/expressionTree/expressionTreeOperators.js';
import { globalUnsanitizedInput, globalTrees } from './globalTestCases.js';
import { parseToTree, evaluateExpression } from '../../src/index.js';


test('test parseToTree with unsanitzied input', () => {
    for (let i = 0; i < globalUnsanitizedInput.length; i++) {
        const input = globalUnsanitizedInput[i];
        const expectedTree = globalTrees[i];
        const createdTree: ExpressionNode = parseToTree(input, booleanContext);
        expect(createdTree.toString()).equal(expectedTree.toString());
    }
});

test('wrong inputs to parseToTree should throw an error', () => {
    const wrongInputs = [
        "a'!b",  // two types of operators for same canonical form
        "++",    // no variables, just two binary operators
    ]
    for (const input of wrongInputs) {
        expect(() => parseToTree(input, booleanContext)).toThrow();
    }
});

test("evaluateExpression with unsanitized input", () => {
    
    // values for the variables in the globalUnsanitizedInput test cases
    let values: Map<string, boolean>[] = [
        // a*a*a*(b+c)
        new Map([['a', true], ['b', false], ['c', true]]),
        // !(a*b)+c+d
        new Map([['a', false], ['b', true], ['c', false], ['d', true]]),
        // a+(b+c)
        new Map([['a', true], ['b', true], ['c', false]]),
        // !!(a*b)
        new Map([['a', false], ['b', false]]),
        // a+!(b+!c)
        new Map([['a', true], ['b', false], ['c', true]]),
        // a*a*!!!a
        new Map([['a', true]])
    ];

    let expectedResults: boolean[] = [ true, true, true, false , true, false ];

    for (let i = 0; i < globalUnsanitizedInput.length; i++) {
        const input = globalUnsanitizedInput[i];
        const result = evaluateExpression(input, values[i], booleanContext);
        expect(result).toBe(expectedResults[i]);
    }
    
});
