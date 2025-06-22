import { OperatorContext, OperatorMetadata } from "./expressionTreeOperators.js";
import {
    convertAllPostfixToPrefix,
    checkMultipleOperatorsForSameCanonical
} from "./expressionTreeOperatorsUtility.js";

const isLetter = (char: string): boolean => /^[a-zA-Z]$/.test(char);

/**
 * @example invertParens('a(b(c))') // returns 'a)b)c(('
 */
function invertParens(expr: string): string {
    const inverted = {
        '(': ')',
        ')': '('
    };
    return expr.split('').map(char => inverted[char] || char).join('');
}

/**
 * @example addAndOperator('ab+c') // returns 'a&b+c'
 * @example addAndOperator('a~(b+c)') // returns 'a&~(b+c)'
 *
 * Cases:
 * 1. Two letters are next to each other
 * 2. A letter or a Not symbol (Standard: ~) is followed by a (
 * 3. A ) is followed by a letter or a Not symbol (Standard: ~)
 * 4. A ) is followed by a (
 * 5. A letter is followed by a Not Symbol (Standard: ~)
*/
export function addAndOperator(
    expression: string,
    symbol: string = '*',
    notSymbol: string = '!' 
): string {

    let newExpression = '';
    for (let i = 0; i < expression.length; i++) {
        newExpression += expression[i];
        if (i < expression.length - 1) {
            const currentChar = expression[i];
            const nextChar = expression[i + 1];
            if ((isLetter(currentChar) && isLetter(nextChar)) || // case 1
                (isLetter(currentChar) && nextChar === '(') || // case 2
                (currentChar === ')' && (isLetter(nextChar) || (nextChar === notSymbol))) || // case 3
                (currentChar === ')' && (nextChar === '(' || (nextChar === notSymbol))) || // case 4
                (isLetter(currentChar) && nextChar === notSymbol) // case 5
            ) {
                newExpression += symbol; // add and operator
            }
        }
    }

    return newExpression;
};

/**
 * @example convertPrefixToPostfix("!(a*b)", "'") // returns (a*b)'
 * In some cases, not symbols are preferred in postfix notation.
 */
export function convertPrefixToPostfix(
    expression: string,
    variables: string[] = [],
    symbol: string = '!',
    changeSymbol: string = "'",
): string {

    // we do this right at the beginning to avoid a lot of unnecessary checks later
    if (!balancedParentheses(expression)) {
        throw new Error("Unbalanced parentheses in expression");
    }

    let newExpression: string[] = [];
    let stack: number[] = [];
    let currentChar: string;
    let nextChar: string | undefined = '';
    let symbolCount = 0; // basically how many ! symbols are in a row in front of either a variable or a (

    for (let i = 0; i < expression.length; i++) {
        currentChar = expression[i];
        nextChar = expression[i + 1];

        if (currentChar === symbol) { // if ! detected
            symbolCount = 1;

            if (nextChar === undefined) {
                throw new Error("Invalid expression: trailing '!' without operand");
            }

            while (nextChar === symbol) { // keep counting !'s
                symbolCount++;
                i++;

                if (i + 1 < expression.length) {
                    currentChar = expression[i];
                    nextChar = expression[i + 1];
                } else {
                    throw new Error("Invalid expression: trailing '!' without operand");
                }
            }

            // at this point all !'s are basically registered, now decide if a open parenthesis or a variable follows
            if (i + 1 < expression.length && variables.includes(nextChar)) {
                newExpression.push(nextChar + changeSymbol.repeat(symbolCount));
                i++;
            } else {
                if (nextChar === '(') {
                    stack.push(symbolCount); // here we keep track of all open parentheses and how many !'s are in front of them
                    newExpression.push('(');
                    i++; // skip the (
                }
            }
        } else if (variables.includes(currentChar)) { // just simple variable
            newExpression.push(currentChar);

        // here we now close the parentheses and add the trailing "'" symbols
        } else if (currentChar === ')' && stack.length !== 0) { // if )
            const lastSymbolCount = stack.pop()!;
            newExpression.push(')');
            for (let j = 1; j < lastSymbolCount; j++) {
                newExpression.push(changeSymbol);
            }
            newExpression.push(changeSymbol);

        // operators
        } else {
            newExpression.push(currentChar);
        }
    }

    return newExpression.join('');
};

/**
 * @example convertPostfixToPrefix("a'*b'*c'", "'") // returns !a!b!c
 * Trick: reverse the expression, convert it to prefix, then reverse it again.
 */
export function convertPostfixToPrefix(
    expression: string,
    variables: string[] = [],
    symbol: string = "'",
    changeSymbol: string = '!'
): string {
    // reverse the expression, and then invert the parentheses
    let reversedExpression = invertParens(expression.split('').reverse().join(''));

    const newExpression: string = convertPrefixToPostfix(
        reversedExpression,
        variables,
        symbol,
        changeSymbol
    );

    // reverse the result again
    return invertParens(newExpression.split('').reverse().join(''));
};

/**
 * @example balancedParentheses('((a&b)|c)') // returns true
 */
function balancedParentheses(expression : string) : boolean {
    let stack = [];
    for (let char of expression) {
        if (char === '(') {
            stack.push(char);
        } else if (char === ')') {
            if (stack.length === 0) {
                return false;
            }
            stack.pop();
        }
    }
    return stack.length === 0;
};


export function checkAndSantizeExpression(
    expression: string,
    operatorContext: OperatorContext,
    variables: string[],
    settings: { addAndOperator: boolean } = { addAndOperator: true }
) : string {

    const operators: Record<string, OperatorMetadata> = operatorContext.operatorMetadata;

    // checks if chars other than variables, operators, and braces are present
    for (const char of expression) {
        if (!variables.includes(char) &&
            !Object.keys(operators).includes(char) &&
            !['(', ')'].includes(char)) {
            throw new Error(`Invalid character in expression: ${char}`);
        }
    }

    // no binary operators at start or end of expression
    if ((operators[expression[0]] && operators[expression[0]].type === 'binary') ||
        (operators[expression[expression.length - 1]] && operators[expression[expression.length - 1]].type === 'binary')) {
        throw new Error(`Expression cannot start or end with a binary operator: ${expression}`);
    }

    if (!balancedParentheses(expression)) {
        throw new Error(`Unbalanced parentheses in expression: ${expression}`);
    }

    // check for each operator if it is also present in a different notation / with different symbol
    if (checkMultipleOperatorsForSameCanonical(expression, operatorContext)) {
        throw new Error(`Multiple operators with the same canonical form found in expression: ${expression}`);
    }
    
    // parser only handles prefix notation operators
    expression = convertAllPostfixToPrefix(expression, operatorContext, variables);

    if (settings.addAndOperator) {
        expression = addAndOperator(expression);
    }

    return expression;
};