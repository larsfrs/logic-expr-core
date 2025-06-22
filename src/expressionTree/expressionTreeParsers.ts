import { ExpressionNode, UnaryOperatorNode, BinaryOperatorNode, LeafNode } from './expressionTree.js';
import { OperatorContext, OperatorMetadata } from './expressionTreeOperators.js';

/**
 * expression as string => RPN using the Shunting Yard algorithm
 */
export function expressionToRPN(
    expression : string,
    operatorContext: OperatorContext,
    variables: string[] = [],
) : string[] {

    const allOperators = operatorContext.operatorMetadata;
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];
    const operatorConcat = Object.keys(allOperators)
        .map(char => /[\\^$*+?.()|[\]{}\-]/.test(char) ? '\\' + char : char)
        .join('');
    const variableConcat = variables.join('');

    // operatorConcat, variableConcat, and parentheses
    const tokens = expression.match(new RegExp(`([${operatorConcat}])|([${variableConcat}]+)|([()])`, 'g'));

    if (!tokens) {
        throw new Error("Invalid expression format");
    }

    for (const token of tokens) {

        // variable or constant
        if (token.match(/[a-zA-Z]+/) || token.match(/[0-9]+/)) {
            outputQueue.push(token);

        // left parenthesis
        } else if (token === '(') {
            operatorStack.push(token);

        // right parenthesis
        } else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack.length === 0 || operatorStack[operatorStack.length - 1] !== '(') {
                throw new Error("Mismatched parentheses in expression");
            }
            operatorStack.pop(); // discard left parenthesis

        // operator
        } else if (operatorConcat.includes(token)) {
            const precedence = allOperators[token].precedence;
            const associativity = allOperators[token].associativity;

            while (operatorStack.length > 0) {
                const topOperator = operatorStack[operatorStack.length - 1];

                if (topOperator === '(') break;

                const topPrecedence = allOperators[topOperator].precedence;

                const shouldPop =
                    (associativity === 'left' && precedence <= topPrecedence) ||
                    (associativity === 'right' && precedence < topPrecedence);
                if (!shouldPop) break;

                outputQueue.push(operatorStack.pop()!);
            }

            operatorStack.push(token);
        }

        else {
            throw new Error(`Unknown token in expression: ${token}`);
        }
    }

    return [...outputQueue, ...operatorStack.reverse()];
}    

/**
 * RPN => ExpressionNode tree
 */
export function RPNToGraph(
    rpn: string[],
    operatorContext: OperatorContext
) : ExpressionNode {

    const allOperators = operatorContext.operatorMetadata;
    
    const stack: ExpressionNode[] = [];

    for (const token of rpn) {
        // variable: leaf note
        if (!allOperators[token]) {
            stack.push(new LeafNode(token));
            continue;
        }

        // operator: unary or binary
        if (allOperators[token].type === 'binary') {
            if (stack.length < 2) {
                throw new Error("Invalid RPN expression: not enough operands for binary operator");
            }
            const right = stack.pop()!;
            const left = stack.pop()!;
            stack.push(new BinaryOperatorNode(left, right, token));
            
        } else {
            if (stack.length < 1) {
                throw new Error("Invalid RPN expression: not enough operands for unary operator");
            }
            const left = stack.pop()!;
            stack.push(new UnaryOperatorNode(left, token));
        }
    }

    return stack.length === 1 ? stack[0] : null; // return the root of the expression tree
}


/**
 * @example evaluateExpression(
 *          { left: 'a', right: { left: 'b', right: 'c', operator: '&' }, operator: '|' },
 *          [['a', 1], ['b', 0], ['c', 1]]) // returns true
 */
export function evaluateExpression(
    expressionNode : ExpressionNode | string | boolean | null,
    variables : Map<string, boolean>
): boolean {
    if (typeof expressionNode === 'string') {
        return variables.get(expressionNode) ?? false; // default to false if variable not found
    } else if (typeof expressionNode === 'boolean') {
        return expressionNode;
    } else if (expressionNode === null) {
        return false; // or throw an error based on your requirements
    }

    return expressionNode.evaluate(variables);
}