import { convertPostfixToPrefix } from "./expressionTreeHelper.js";
import { OperatorContext } from "./expressionTreeOperators.js";


/**
 * @example checkMultipleOperatorsForSameCanonical("!a+b'", ..) // returns true,
 * as there are multiple operators for the same canonical form (!a and a').
 */
export function checkMultipleOperatorsForSameCanonical(
    expression: string,
    OperatorContext: OperatorContext
): boolean {
    const operators = OperatorContext.operatorMetadata;
    const canonicalMap: Record<string, Set<string>> = {};

    for (const char of expression) {
        if (operators[char]) {
            const canonical = operators[char].canonical;
            if (!canonicalMap[canonical]) {
                canonicalMap[canonical] = new Set();
            }
            canonicalMap[canonical].add(char);
            if (canonicalMap[canonical].size > 1) {
                // More than one operator for the same canonical form
                return true;
            }
        }
    }

    return false;
}


/**
 * Goes through the expression and converts all postfix operators to prefix.
 */
export function convertAllPostfixToPrefix(
    expression: string,
    operatorContext: OperatorContext,
    variables: string[],
): string {
    let postfixOperators: Record<string, boolean> = {};
    let newExpression = expression;
    const operators = operatorContext.operatorMetadata;

    for (const char of expression) {
        
        if (!operatorContext.operatorMetadata[char]) {
            continue;
        }
        
        if (operatorContext.operatorMetadata[char].notation === 'postfix') {
            if (postfixOperators[char]) {
                continue; // already found this operator
            }
            postfixOperators[char] = true;
        }

    }

    // now for each postfix operator, convert it to prefix
    for (const operator in postfixOperators) {
        if (operators[operator].notation === 'postfix') {

            // find other canonicaly same operator with prefix notation 
            let newOperator = operator;
            const canoncial = operators[operator].canonical;
            for (const otherOperator in operators) {
                if (operators[otherOperator].canonical === canoncial
                    && operators[otherOperator].notation === 'prefix') {
                    newOperator = otherOperator;
                    break;
                }
            }

            // convert the operator to prefix
            newExpression = convertPostfixToPrefix(newExpression, variables, operator, newOperator);
        }
    }


    return newExpression;
}


export const getVariablesFromExpression = (expression: string): string[] => {
    // variables can only be singular letters, upper or lower case
    const variables = new Set<string>();
    for (const char of expression) {
        if (/[a-zA-Z]/.test(char)) {
            variables.add(char);
        }
    }
    return Array.from(variables).sort();
}