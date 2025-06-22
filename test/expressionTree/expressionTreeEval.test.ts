import { expect, test, beforeAll } from 'vitest';

let startingInputs: any[] = [];

beforeAll(() => {

    // expression, expected, and symbol, notSymbol, notNotation,
    startingInputs: [
        ["ab(c+aa)", { "a": true, "b": true, "c": true }, "true"],
        ["a'b'c'", { "a": false, "b": false, "c": false }, "true"],
        ["ab''c'aa(c+a)", { "a": true, "b": false, "c": true }, "true"],
    ];
});
test('test the evaluation', () => {
    expect(true).toBe(true);
});

