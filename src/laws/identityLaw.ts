import { ExpressionTreeHistory } from "../transformations/expressionTreeHistory.js";
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
    history?: ExpressionTreeHistory
): ExpressionNode {

    if (expressionNode instanceof LeafNode) {
        return expressionNode;
    }

    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = identityLaw(
            expressionNode.left,
            operator,
            identityElement,
            history
        );
        return expressionNode;
    }

    if (expressionNode instanceof NaryOperatorNode) {
        expressionNode.children = expressionNode.children.map(child =>
            identityLaw(
                child,
                operator,
                identityElement,
                history
            )
        );

        if (expressionNode.operator === operator) {

            // remove identity element from children
            const newChildren = expressionNode.children.filter(child => {
                if (child instanceof LeafNode && child.value === identityElement.value) {
                    if (history) {
                        child.mark = { marked: true, type: 'Identity Law' };
                    }
                    return false;
                }
                return true;
            });

            if (history && newChildren.length < expressionNode.children.length) {
                history.snapshot(expressionNode);
            }

            expressionNode.children = newChildren;

            if (expressionNode.children.length === 0) {
                return identityElement;
                // TODO: unhandled associativity case and root property here

            } else if (expressionNode.children.length === 1) {
                return expressionNode.children[0];
                // TODO: unhandled associativity case and root property here
            }
        }
    }

    return expressionNode;
}

