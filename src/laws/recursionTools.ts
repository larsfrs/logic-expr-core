import { ExpressionNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { NaryOperatorNode } from "../expressionTree/naryTree.js";

export function updateParentChildren(
    newNode: ExpressionNode,
    parent: ExpressionNode | null,
    expressionNode: ExpressionNode
): void {
    if (!parent) return; // no parent to update, likely the root node
    if (parent instanceof NaryOperatorNode) {
        parent.children[parent.children.indexOf(expressionNode)] = newNode;
    } else if (parent instanceof UnaryOperatorNode) {
        parent.left = newNode;
    }
}