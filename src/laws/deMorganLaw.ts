import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { NaryOperatorNode } from "../expressionTree/naryTree.js";
import { associativityLaw } from "../laws/associativityLaw.js";


/**
 * Checks if current node, which is a UnaryOperatorNode with operator '!',
 * has a child that is also a UnaryOperatorNode with operator '!', and if so,
 * it returns the child of that child, effectively removing the double negation.
 */
function applyDoubleNegation(node: ExpressionNode): ExpressionNode {
    if (node instanceof UnaryOperatorNode && node.operator === '!') {
        if (node.left instanceof UnaryOperatorNode && node.left.operator === '!') {
            return node.left.left;
        }
    }
    return node;
}


/**
 * Bottom-up recursive application of the deMorgan law on a given expression tree.
 * Uses the n-ary operator node.
 * 
 * 1. !(A * B * C) = !A + !B + !C
 * 2. !(A + B + C) = !A * !B * !C (same as 1, with roles of operators reversed)
 */
export function deMorgan(
    expressionNode: ExpressionNode,
    deMorganOverOperator: string = "!",
    andOperator: string = "*",
    orOperator: string = "+"
): ExpressionNode {

    if (expressionNode instanceof LeafNode) return expressionNode;
    
    // unary operator found, its the negation operator
    if (expressionNode instanceof UnaryOperatorNode &&
        expressionNode.operator === deMorganOverOperator) {

        // is the child an n-ary operator with AND or OR operator?
        if (expressionNode.left instanceof NaryOperatorNode &&
            (expressionNode.left.operator === orOperator || expressionNode.left.operator === andOperator)) {

            const newOperator = (expressionNode.left.operator === orOperator) ? andOperator : orOperator;
            const negatedChildren = expressionNode.left.children.map(
                // here, as we create a new negation, double negation has to be checked and removed
                child => applyDoubleNegation(new UnaryOperatorNode(child, deMorganOverOperator))
            );
            return new NaryOperatorNode(negatedChildren, newOperator);
        
        // child is either not an NaryOperatorNode, or it is but its operator is not AND or OR 
        } else {

            // just continue recursion
            expressionNode.left = deMorgan(expressionNode.left, deMorganOverOperator, andOperator, orOperator);
            return expressionNode;
        }
    }

    // unary operator found, but not the negation operator
    // with boolean logic this case should not happen, as ! is the only unary operator
    if (expressionNode instanceof UnaryOperatorNode &&
        expressionNode.operator !== deMorganOverOperator) {

        // just continue recursion
        expressionNode.left = deMorgan(expressionNode.left, deMorganOverOperator, andOperator, orOperator);
        
        // here, tecvhnically a new node after recursion could be a unary node
        // with '!' operator, so we apply double negation
        return applyDoubleNegation(expressionNode);
    }
    
    // n-ary operator found
    if (expressionNode instanceof NaryOperatorNode) {

        // if we just encounter an NaryOperatorNode, we apply deMorgan recursively to all children
        expressionNode.children = expressionNode.children.map(child =>
            deMorgan(child, deMorganOverOperator, andOperator, orOperator)
        );
        
        // only here we check for associativity, as here we can compare if new children
        // have the same operator as the parent node of the n-ary node
        return associativityLaw(expressionNode);
    }
}