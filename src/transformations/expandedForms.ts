import { ExpressionNode, LeafNode, UnaryOperatorNode, BinaryOperatorNode } from '../expressionTree/expressionTree.js';
import { NaryOperatorNode } from '../expressionTree/naryTree.js';


/**
 * Recognizes all variables in the expression tree and returns them as a set,
 * by recursively collecting all LeafNode values that are not '0' or '1'.
 */
export function getVariablesFromTree(
    expressionNode: ExpressionNode,
    variables: Set<string> = new Set<string>()
): Set<string> {
    if (expressionNode instanceof LeafNode) {
        // ignore constants '0' and '1'
        if (!/^[01]$/.test(expressionNode.value)) {
            variables.add(expressionNode.value);
        }
    } else if (expressionNode instanceof UnaryOperatorNode) {
        getVariablesFromTree(expressionNode.left, variables);
    } else if (expressionNode instanceof BinaryOperatorNode) {
        getVariablesFromTree(expressionNode.left, variables);
        getVariablesFromTree(expressionNode.right, variables);
    } else if (expressionNode instanceof NaryOperatorNode) {
        for (const child of expressionNode.children) {
            getVariablesFromTree(child, variables);
        }
    }
    return variables;
}


/**
 * Adds missing variables to each term in the expression, which is
 * in a normal form.
 */
export function expandNormalForm(
    expressionNode: ExpressionNode,
    variables: Set<string>,
    conjunctionOp: string = '*', // default DNF
    disjunctionOp: string = '+' // default DNF
): ExpressionNode {

    function extendConjunction(
        naryNode: NaryOperatorNode,
        variables: Set<string>
    ) {
        // copy variables into missingVariables
        const missingVariables = new Set<string>(variables);

        for (const grandChild of naryNode.children) {

            // get missing variables
            if (grandChild instanceof LeafNode) {
                missingVariables.delete(grandChild.value);
            } else if (grandChild instanceof UnaryOperatorNode && grandChild.operator === '!') {
                if (grandChild.left instanceof LeafNode) {
                    missingVariables.delete(grandChild.left.value);
                } else {
                    throw new Error(`expandNormalForm: grandChild is a unary node but its child is not a leaf: ${grandChild.toString()}`);
                }
            } else {
                throw new Error(`expandNormalForm: grandChild is neither a leaf nor a negated leaf: ${grandChild.toString()}`);
            }
        }
        
        // add missing conjunctions
        for (const variable of missingVariables) {
            const tempList: ExpressionNode[] = [];
            tempList.push(new LeafNode(variable));
            tempList.push(new UnaryOperatorNode(new LeafNode(variable), '!'));
            naryNode.children.push(new NaryOperatorNode(tempList, disjunctionOp));
        }

        return naryNode;
    }

    if (expressionNode instanceof LeafNode || expressionNode instanceof UnaryOperatorNode) {
        const newConjunction = new NaryOperatorNode([expressionNode], conjunctionOp);
        return expandNormalForm(newConjunction, variables, conjunctionOp, disjunctionOp);
    }

    if (expressionNode instanceof NaryOperatorNode && expressionNode.operator === conjunctionOp) {
        return expandNormalForm(new NaryOperatorNode([expressionNode], disjunctionOp), variables, conjunctionOp, disjunctionOp);
    }

    if (expressionNode instanceof NaryOperatorNode && expressionNode.operator === disjunctionOp) {
        expressionNode.children = expressionNode.children.map(child =>
            child instanceof NaryOperatorNode ? extendConjunction(child, variables) : extendConjunction(new NaryOperatorNode([child], conjunctionOp), variables)
        );
    } else {
        throw new Error(`expandNormalForm: expressionNode is not an n-ary node with operator '${disjunctionOp}'
            at last step: ${expressionNode.toString()}`);
    }

    return expressionNode;
}


/**
 * Checks if the expression is in an expanded normal form.
 */
export function isInExpandedForm(
    expressionNode: ExpressionNode,
    variables: Set<string> = getVariablesFromTree(expressionNode),
    conjunctionOp: string = '*', // default DNF
    disjunctionOp: string = '+', // default DNF
) {

    /**
     * If the root is not a disjunction, possible cases are:
     * 1. A LeafNode or UnaryOperatorNode with a NOT operator and a LeafNode child
     * 2. A NaryOperatorNode with a conjunction operator, meaning there is only one conjunction
     * In both cases, we can wrap the expression in a disjunction and check again
     */
    if (!(expressionNode instanceof NaryOperatorNode && expressionNode.operator === disjunctionOp)) {
        if (expressionNode instanceof NaryOperatorNode && expressionNode.operator === conjunctionOp) {
            return isInExpandedForm(
                new NaryOperatorNode([expressionNode], disjunctionOp),
                variables,
                conjunctionOp,
                disjunctionOp
            )
        } else if (expressionNode instanceof LeafNode) {
            return true;
        } else if (expressionNode instanceof UnaryOperatorNode
            && expressionNode.operator === '!'
            && expressionNode.left instanceof LeafNode) {
            return true;
        } else {
            return false;
        }
    }

    for (const child of expressionNode.children) {
        if (!(child instanceof NaryOperatorNode && child.operator === conjunctionOp)) {
            return false;
        }

        // create set & count found variables
        var foundVariables = new Set<string>();
        
        for (const grandChild of child.children) {
            if (grandChild instanceof LeafNode) {
                foundVariables.add(grandChild.value);
            } else if (grandChild instanceof UnaryOperatorNode && grandChild.operator === '!') {
                if (grandChild.left instanceof LeafNode) {
                    foundVariables.add(grandChild.left.value);
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        return equalSets(variables, foundVariables);
    }
    return true;
}


export function equalSets<T>(setA: Set<T>, setB: Set<T>): boolean {
    if (setA.size !== setB.size) return false;
    for (const item of setA) {
        if (!setB.has(item)) return false;
    }
    return true;
}