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
    maxIterations: number = expression.length * 2
): string {

    // we do this right at the beginning to avoid a lot of unnecessary checks later
    if (!balancedParentheses(expression)) {
        throw new Error("Unbalanced parentheses in expression");
    }

    let result: string[] = [];
    let stack: number[] = [];
    let i = 0;
    let counter = 0;

    while (i < expression.length) {
        let currentChar = expression[i];

        // handle the symbols
        if (currentChar === symbol) {
            let symCount = 1;
            
            // count consecutive symbols
            while (i + symCount < expression.length && expression[i + symCount] === symbol) {
                symCount++;
            }
            i += symCount;
            let nextChar = expression[i];

            if (variables.includes(nextChar)) {
                result.push(nextChar + changeSymbol.repeat(symCount));
                i++;
            } else if (nextChar === '(') {
                stack.push(symCount);
                result.push('(');
                i++;
            } else {
                throw new Error(`Invalid expression: ${symbol} not followed by variable or '('.`);
            }
        }

        // variable handling
        else if (variables.includes(currentChar)) {
            result.push(currentChar);
            i++;
        }

        // paranthesis handling
        else if (currentChar === '(') {
            stack.push(0); // No negation for this parenthesis
            result.push('(');
            i++;
        }

        // closing parenthesis handling
        else if (currentChar === ')') {
            result.push(')');
            let symCount = stack.pop()!;
            if (symCount > 0) {
                result.push(changeSymbol.repeat(symCount));
            }
            i++;
        }

        // operator handling
        else {
            result.push(currentChar);
            i++;
        }

        counter++;
        if (counter > maxIterations) {
            throw new Error("Invalid Expression: maxIterations exceeded in convertPrefixToPostfix");
        }
    }

    return result.join('');
}

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