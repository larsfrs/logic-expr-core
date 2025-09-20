import { beforeAll, expect, test } from "vitest";
import { addAndOperator, convertPostfixToPrefix, convertPrefixToPostfix } from "../../src/expressionTree/expressionTreeHelper.js";

let inputUnsanitized: string[][] = [];
let inputPrefixNot: string[][] = [];

beforeAll(() => {
    // cases described in expressionTreeHelper.ts, addAndOperator()
    inputUnsanitized = [
        ["ab+c", "a*b+c"],                // case 1
        ["a(b+c)", "a*(b+c)"],            // case 2a
        ["aaaa(b+c)", "a*a*a*a*(b+c)"],
        ["a!(b+c)", "a*!(b+c)"],          // case 2b
        ["(a+b)c", "(a+b)*c"],            // case 3a
        ["(a+b)!c", "(a+b)*!c"],          // case 3b
        ["(a+b)(c+d)", "(a+b)*(c+d)"],    // case 4
        ["a!b", "a*!b"],                  // case 5
        ["a!!!b", "a*!!!b"],
        ["(a+(bc))'", "(a+(b*c))'"]
    ]

    inputPrefixNot = [
        ["!(a*b)", "(a*b)'"],                           // basic test cases
        ["a*!b*c", "a*b'*c"],
        ["b*(a+!a)*!c", "b*(a+a')*c'"],                 // handle NOT inside a bracket
        ["!!(a+!a)*!(a*a)", "(a+a')''*(a*a)'"],         // handle multiple NOT's before and after brackets
        ["!!!(!a+!(!a+b))", "(a'+(a'+b)')'''"],
        ["!a*!b*!!(!!a+b)+!c", "a'*b'*(a''+b)''+c'"],
        ["!(!a)!(!a)", "(a')'(a')'"],                   // handle consecutive brackets 
        ["!(a+(b*c))", "(a+(b*c))'"]
    ];
});

test("addAndOperator", () => {
    for (let i = 0; i < inputUnsanitized.length; i++) {
        const [input, expected] = inputUnsanitized[i];
        const result = addAndOperator(input);
        expect(result).toBe(expected);
    }
});


test("convertPrefixToPostfix", () => {
    for (let i = 0; i < inputPrefixNot.length; i++) {
        const [input, expected] = inputPrefixNot[i];
        const result = convertPrefixToPostfix(input, ['a', 'b', 'c', 'd'], '!', "'");
        expect(result).toBe(expected);
    }
});


test("convertPostfixToPrefix", () => {
    for (let i = 0; i < inputPrefixNot.length; i++) {
        const [input, expected] = inputPrefixNot[i];
        const result = convertPostfixToPrefix(expected, ['a', 'b', 'c', 'd'], "'", '!');
        expect(result).toBe(input);
    }
});