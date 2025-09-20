import { NaryOperatorNode } from '../expressionTree/naryTree.js';
import { ExpressionNode } from '../expressionTree/expressionTree.js';


export function associativityLawChildren(
    newChildren: ExpressionNode[],
    operator: string
): ExpressionNode[] {
    return newChildren.flatMap(child =>
        child instanceof NaryOperatorNode
        && child.operator === operator
            ? child.children
            : [child]
    );
}

export function associativityLaw(
    node: NaryOperatorNode,
): ExpressionNode {
    node.children = associativityLawChildren(node.children, node.operator);
    return node;
}