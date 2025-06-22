import { ExpressionNode } from "./expressionTree/expressionTree.js";
import { OperatorContext, booleanContext } from "./expressionTree/expressionTreeOperators.js";
import { getVariablesFromExpression } from "./expressionTree/expressionTreeOperatorsUtility.js";
import { RPNToGraph, expressionToRPN } from "./expressionTree/expressionTreeParsers.js";
import { checkAndSantizeExpression } from "./expressionTree/expressionTreeHelper.js";

export * from "./expressionTree/index.js";

/**
 * Parses a boolean expression string into a tree structure.
 * @param expression - the expression to parse
 * @param operatorContext - the context of operators to use, defaults to the boolean context
 * @param variables - list of variables in the expression, defaults to all variables found in the expression
 * @param settings
 * @param settings.addAndOperator - whether to add the AND operator (&) to the expression, defaults to true
 * @returns - an ExpressionNode, which is the root of the expression tree.
 */
export function parseToTree(
    expression: string,
    operatorContext: OperatorContext = booleanContext,
    variables: string[] = getVariablesFromExpression(expression),
    settings: { addAndOperator: boolean } = { addAndOperator: true },
): ExpressionNode {

    const sanitizedExpression = checkAndSantizeExpression(expression, operatorContext, variables, settings);
    const createdRPN = expressionToRPN(sanitizedExpression, operatorContext, variables);
    return RPNToGraph(createdRPN, operatorContext);
}


/**
 * Evaluates a boolean expression string with variables, passed as a record.
 * @param expression 
 * @param values - a Map of variable names to boolean values, e.g. new Map([['a', true], ['b', false]])
 * @param operatorContext - the context of operators to use, defaults to the boolean context
 * @param variables - list of variables in the expression, defaults to all variables found in the expression
 * @param settings
 * @param settings.addAndOperator - whether to add the AND operator (&) to the expression, defaults to true
 * @returns - the result of the evaluation, true or false
 */
export function evaluateExpression(
    expression: string,
    values: Map<string, boolean>,
    operatorContext: OperatorContext = booleanContext,
    variables: string[] = getVariablesFromExpression(expression),
    settings: { addAndOperator: boolean } = { addAndOperator: true },
): boolean {

    // check if all variables are present in the values object
    for (const variable of variables) {
        if (!values.has(variable)) {
            throw new Error(`Variable "${variable}" does not have a value in the provided values object. (t/f)`);
        }
    }

    const expressionTree = parseToTree(expression, operatorContext, variables, settings);
    return expressionTree.evaluate(values);
}