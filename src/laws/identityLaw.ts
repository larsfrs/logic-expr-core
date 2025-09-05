import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { NaryOperatorNode } from '../expressionTree/naryTree.js';


/**
 * Bottom-up recursive implementation of the identity law.
 * 
 * A + (B + C) + 0 = A + (B + C)
 * A * (B * C) * 1 = A * (B * C)
 */
export function identityLaw(
    expressionNode: ExpressionNode,
    operator: string = "+", // *
    identityElement: LeafNode = new LeafNode('0'), // new LeafNode('1')
): ExpressionNode {

    if (expressionNode instanceof LeafNode) {
        return expressionNode;
    }

    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = identityLaw(expressionNode.left, operator, identityElement);
        return expressionNode;
    }

    if (expressionNode instanceof NaryOperatorNode) {
        expressionNode.children = expressionNode.children.map(child =>
            identityLaw(child, operator, identityElement)
        );

        if (expressionNode.operator === operator) {

            // remove identity element from children
            expressionNode.children = expressionNode.children.filter(child => {
                if (child instanceof LeafNode && child.value === identityElement.value) {
                    return false;
                }
                return true;
            });

            if (expressionNode.children.length === 0) {
                return identityElement;

            } else if (expressionNode.children.length === 1) {
                return expressionNode.children[0];
            }
        }
    }

    return expressionNode;
}

