import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { NaryOperatorNode } from '../expressionTree/naryTree.js';

/**
 * Bottom-up recursive implementation of the dominant law.
 * 
 * A + (B + C + D) + 1 = 1
 * A * (B * C * D) * 0 = 0
 */
export function dominantLaw(
    expressionNode: ExpressionNode,
    operator: string = '+', // *
    dominantElement: LeafNode = new LeafNode('0') // new LeafNode('1')
) : ExpressionNode {

    if (expressionNode instanceof LeafNode) {
        return expressionNode;
    }

    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = dominantLaw(expressionNode.left, operator, dominantElement);
        return expressionNode;
    }

    if (expressionNode instanceof NaryOperatorNode) {
        expressionNode.children = expressionNode.children.map(child =>
            dominantLaw(child, operator, dominantElement)
        );
        if (expressionNode.operator === operator) {
            // if there is a dominantElement in the children, return dominantElement
            const hasDominant = expressionNode.children.some(child => {
            return child instanceof LeafNode && child.value === dominantElement.value;
            });

            if (hasDominant) return dominantElement;
        }
    }

    return expressionNode;
}