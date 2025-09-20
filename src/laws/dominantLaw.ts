import { ExpressionTreeHistory } from "../transformations/expressionTreeHistory.js";
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
    dominantElement: LeafNode = new LeafNode('0'), // new LeafNode('1')
    history?: ExpressionTreeHistory
) : ExpressionNode {

    if (expressionNode instanceof LeafNode) {
        return expressionNode;
    }

    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = dominantLaw(
            expressionNode.left,
            operator,
            dominantElement,
            history
        );
        return expressionNode;
    }

    if (expressionNode instanceof NaryOperatorNode) {
        expressionNode.children = expressionNode.children.map(child =>
            dominantLaw(child, operator, dominantElement, history)
        );
        if (expressionNode.operator === operator) {
            // if there is a dominantElement in the children, return dominantElement
            const hasDominant = expressionNode.children.some(child => {
                return child instanceof LeafNode
                    && child.value === dominantElement.value;
            });

            if (hasDominant) {
                
                if (history) {
                    expressionNode.mark = { marked: true, type: 'Dominant Law', colorGroup: "palegreen" };
                    history.snapshot(expressionNode);
                }

                // TODO: handle associativity, as well as root property here

                return dominantElement;
            }
        }
    }

    return expressionNode;
}