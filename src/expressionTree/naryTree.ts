import { ExpressionNode, BinaryOperatorNode, LeafNode, UnaryOperatorNode } from '../expressionTree/expressionTree.js';
import { operatorEvalBoolean, booleanContext } from "../expressionTree/expressionTreeOperators.js";
import { Marking, defaultMarking } from '../expressionTree/markings.js';


/**
 * For certain transformations, we need to basically shuffle operands of associative and commutative operators around,
 * to see if we can apply a rule to two of them for simplifications. In binary trees, this seems to be a bit hard to do,
 * so this N-ary node is implemented to make it easier to work with such expressions.
 * 
 * 1 child => UnaryOperatorNode (as before)
 * 2+ children => NaryOperatorNode
 */
export class NaryOperatorNode extends ExpressionNode {
    constructor(
        public children: ExpressionNode[],
        public operator: string,
        public root: boolean = false,
        public mark: Marking = defaultMarking
    ) {
        super();
    }

    evaluate(variables: Map<string, boolean>): boolean {
        return this.children.reduce((acc, child) => {
            return operatorEvalBoolean[this.operator](acc, child.evaluate(variables));
        }, this.children[0].evaluate(variables));
    }

    toString(
        parentPrecedence: number = 0,
        isRightChild: boolean = false,
        sorted: boolean = false,
        settings: { latex: boolean } = { latex: false }
    ): string {
        const precedence = booleanContext.operatorMetadata[this.operator].precedence || 0;
        const childStrings = this.children.map(child => child.toString(precedence, isRightChild, sorted, settings));

        // sort children AFTER generating their string representations
        if (sorted) childStrings.sort((a, b) => a.localeCompare(b));

        const opString = settings.latex && booleanContext.operatorMetadata[this.operator].canonical === 'MULTIPLY'
            ? '\\cdot ' : this.operator;

        // THEN join them with the operator
        let joinedChildren = childStrings.join(opString);
        if (settings.latex && this.mark.marked) {
            joinedChildren = `\\colorbox{${this.mark.colorGroup}}{\$${joinedChildren}\$}`;
            joinedChildren = `\\underbrace{${joinedChildren}}_{\\text{${this.mark.type}}}`;
        }

        return (precedence < parentPrecedence) ? `(${joinedChildren})` : joinedChildren;
    }
}


/**
 * If a binary operator node has a child with the same operator,
 * and that operator is commutative & associative, build a left-associative n-ary node from
 * the binary tree "chain" instead.
 * E.g. ((A + B) + CD) => A + B + CD
 * Important: This creates a new instance of the expression tree.
 */
export function binaryToNaryTree(expression: ExpressionNode): ExpressionNode {

    if (expression instanceof LeafNode) {
        return new LeafNode(expression.value, expression.root, expression.mark);
    }

    if (expression instanceof UnaryOperatorNode) {
        return new UnaryOperatorNode(
            binaryToNaryTree(expression.left),
            expression.operator,
            expression.root,
            expression.mark
        );
    }

    if (expression instanceof BinaryOperatorNode) {
        const left = binaryToNaryTree(expression.left);
        const right = binaryToNaryTree(expression.right);

        if (left instanceof NaryOperatorNode && left.operator === expression.operator) {
            left.children.push(right);
            left.root ||= expression.root; // propagate root property correctly
            return left;

        } else if (right instanceof NaryOperatorNode && right.operator === expression.operator) {
            right.children.unshift(left);
            right.root ||= expression.root; // propagate root property correctly
            return right;

        } else {
            const root = expression.root || left.root || right.root; // determine root property correctly
            return new NaryOperatorNode([left, right], expression.operator, root, expression.mark);
        }
    }

}


/**
 * If a n-ary node has more than 2 children, iterativley build a binary "chain" from left to right.
 * E.g. A + B + C + D  => ((A + B) + C) + D, this preserves the original left-associative structure.
 * Important: This creates a new instance of the expression tree.
 */
export function NaryTreeToBinaryTree(expression: ExpressionNode): ExpressionNode {
    
    if (expression instanceof LeafNode) {
        return new LeafNode(expression.value, expression.root, expression.mark);
    }
    
    if (expression instanceof UnaryOperatorNode) {
        return new UnaryOperatorNode(
            NaryTreeToBinaryTree(expression.left),
            expression.operator,
            expression.root,
            expression.mark
        );
    }
    
    if (expression instanceof NaryOperatorNode) {
        let result = NaryTreeToBinaryTree(expression.children[0]);
        for (let i = 1; i < expression.children.length; i++) {
            result = new BinaryOperatorNode(
                result,
                NaryTreeToBinaryTree(expression.children[i]),
                expression.operator,
                expression.root,
                expression.mark
            );
        }
        return result;
    }
}

/**
 * For the n-ary tree, we need a canonical form to compare expressions.
 * A canonical form is a unique representation of an expression, regardless of
 * the order of operands in commutative operations.
 * For this the children need to be sorted in some deterministic way.
 *
 * By default, toString will sort the children by their string representation.
 * If preserving the original operand order is required, the sorted parameter can be left
 * empty (set to false).
 * 
 * Example:
 * Tree1: A + (B + (D + E))
 * Tree2: (B + (E + D)) + A
 * Here we would need to be able to say that both trees are equivalent, or for
 * example find a matching subtree in a larger expression tree.
 * 
 * Demonstration Test Cases:
 * 1. absorptionLaw.test.ts, case 4, 5
 * 2. complementLaw.test.ts, case 3
 */
export function treeCanonicalForm(expressionNode: ExpressionNode): string {
    return expressionNode.toString(undefined, undefined, true, { latex: false });
}


/**
 * Important for recording a transformation history of an expression tree.
 */
export function deepCopy(node: ExpressionNode): ExpressionNode {
    if (node instanceof UnaryOperatorNode) {
        return new UnaryOperatorNode(
            deepCopy(node.left),
            node.operator,
            node.root,
            node.mark
        );
    }
    if (node instanceof BinaryOperatorNode) {
        return new BinaryOperatorNode(
            deepCopy(node.left),
            deepCopy(node.right),
            node.operator,
            node.root,
            node.mark
        );
    }
    if (node instanceof NaryOperatorNode) {
        return new NaryOperatorNode(
            node.children.map(child => deepCopy(child)),
            node.operator,
            node.root,
            node.mark
        );
    }
    if (node instanceof LeafNode) {
        return new LeafNode(node.value, node.root, node.mark);
    }
    throw new Error('Unknown ExpressionNode type');
}