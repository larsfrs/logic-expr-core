import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { associativityLawChildren } from "../laws/associativityLaw.js";
import { NaryOperatorNode, treeCanonicalForm } from "../expressionTree/naryTree.js";
import { ExpressionTreeHistory } from "../transformations/expressionTreeHistory.js";


function buildFactors(
    children: ExpressionNode[],
    absorptionWithOperator: string
) {
    const factorSets: (Set<string> | null)[] = [];

    // Helper: collect "atomic" factors of a term with respect to the
    // absorptionWithOperator (e.g. '*'). If the node itself is an n-ary node
    // with that operator, its children are the atoms; otherwise the whole
    // node is a single atom.
    const collectAtoms = (node: ExpressionNode): ExpressionNode[] => {
        if (node instanceof NaryOperatorNode && node.operator === absorptionWithOperator) {
            const atoms: ExpressionNode[] = [];
            for (const child of node.children) {
                if (child instanceof NaryOperatorNode && child.operator === absorptionWithOperator) {
                    atoms.push(...child.children);
                } else {
                    atoms.push(child);
                }
            }
            return atoms;
        }
        return [node];
    };

    for (const child of children) {
        const atoms = collectAtoms(child);

        // Build all non-empty proper subsets of atoms and store their
        // canonical forms in the factor set. Example for "abc" (atoms
        // a, b, c): {"a", "b", "c", "ab", "ac", "bc"}.
        if (atoms.length > 1) {
            const set = new Set<string>();
            const m = atoms.length;

            /**
             * 1 << m is a bitwise operation that computes 2^m.
             * We do this to iterate through all possible subsets of the atoms,
             * which are exactly 2^m in number (including the empty set and the full set).
             */
            for (let mask = 1; mask < (1 << m) - 0; mask++) {

                // skip the full set; we only want proper subsets.
                if (mask === (1 << m) - 1) continue;

                const subset: ExpressionNode[] = [];

                /**
                 * Use the mask to create the current subset of atoms.
                 */
                for (let bit = 0; bit < m; bit++) {
                    if (mask & (1 << bit)) subset.push(atoms[bit]);
                }

                const subsetNode = subset.length === 1
                    ? subset[0]
                    : new NaryOperatorNode(subset, absorptionWithOperator);

                set.add(treeCanonicalForm(subsetNode));
            }

            factorSets.push(set);
        } else {

            /**
             * single atom: it has no non-trivial proper factor combinations.
             * Example: "a" => {}
             */
            factorSets.push(new Set());
        }
    }
    
    return factorSets;
}


function computeRemovalMask(
    children: ExpressionNode[],
    factorSets: (Set<string> | null)[],
    absorptionOperator: string
): boolean[] {

    const removalMask: boolean[] = new Array(children.length).fill(false);
    const n = children.length;

    /**
     * Cache canonical forms for grouped subsets of children to avoid
     * recomputing treeCanonicalForm for the same subset.
    */
    const subsetCanonicalCache = new Map<string, string>();

    const getSubsetCanonical = (indices: number[]): string => {
        const key = indices.join(",");
        const cached = subsetCanonicalCache.get(key);
        if (cached) return cached;

        const subsetNodes = indices.map(i => children[i]);
        const node = subsetNodes.length === 1
            ? subsetNodes[0]
            : new NaryOperatorNode(subsetNodes, absorptionOperator);
        const canonical = treeCanonicalForm(node);
        subsetCanonicalCache.set(key, canonical);
        return canonical;
    };

    /**
     * For each child i, check whether there exists a non-empty subset of the
     * *other* children whose combined expression (using the absorption
     * operator) appears as a factor of child i. If so, child i is absorbed
     * and can be removed.
    */
    for (let i = 0; i < n; i++) {
        const factorsI = factorSets[i];
        if (!factorsI || factorsI.size === 0) continue;

        const otherIndices: number[] = [];
        for (let j = 0; j < n; j++) if (j !== i) otherIndices.push(j);

        const m = otherIndices.length;
        let shouldRemove = false;

        // Iterate through all non-empty subsets of otherIndices.
        for (let mask = 1; mask < (1 << m) && !shouldRemove; mask++) {
            const subset: number[] = [];
            for (let bit = 0; bit < m; bit++) {
                if (mask & (1 << bit)) subset.push(otherIndices[bit]);
            }

            const subsetCanonical = getSubsetCanonical(subset);
            if (factorsI.has(subsetCanonical)) {
                shouldRemove = true;
                break;
            }
        }

        removalMask[i] = shouldRemove;
    }

    return removalMask;
}


/**
 * Removal of children from an n-ary operator node based on the absorption law.
 */
function removalStep(
    expressionNode: NaryOperatorNode,
    absorptionOperator: string = "+",
    absorptionWithOperator: string = "*",
    history?: ExpressionTreeHistory
): ExpressionNode[] {

    /**
     * Build combination sets: For each child:
     * 1. canonical form of child
     * 2. canonical form of all children with each other, and the empty set.
     * 
     * Example: On expression "ab + abc" the absoption law could *potentially* be applied,
     *          as absorptionOperator is '+' and absorptionWithOperator is '*'.
     * - for child "abc": {"abc"} UNION {"a", "b", "c", "ab", "ac", "bc"}
     *                   => all strings in the set are in canonical form, so sorted
     * - for child "ab": {"ab"} UNION {"a", "b"}
     *                   => all strings in the set are in canonical form, so sorted
     * 
     * For each child this will result in a runtime of O(n^2) for building the sets.
     * 
     * return: {
     *      canonicals: ["ab", "abc"],
     *      sets: [
     *          Set("a", "b"),                       // for "ab"
     *          Set("a", "b", "c", "ab", "ac", "bc") // for "abc"
     *      ]
     * }
     */
    const factorSets = buildFactors(
        expressionNode.children,
        absorptionWithOperator
    );

    /**
     * Determine which children to remove.
     * For each child: (start with the biggest canonical form children to do potentially big removals first)
     * 1. Compare the canonical expression of the current child to:
     *  - each individual element of the factor set of the other children (cross-type absorption)
     * 
     * Example: "ab + abc"
     * 1. Start with "abc": canonical form is "abc", factor set is {"a", "b", "c", "ab", "ac", "bc"}
     *   - compare to first other child: "ab": canonical form is "ab"
     *    - is "ab" in the factor set of "abc"? Yes => mark "abc" for removal in the mask.
     * 
     * return: [0, 1]
     */
    const remove = computeRemovalMask(
        expressionNode.children,
        factorSets,
        absorptionOperator
    );

    /**
     * From here on out, not much complexity added.
     * Just build the new children array based on the removal mask,
     * and mark the removed children if history is provided.
     */

    const newChildren: ExpressionNode[] = [];
    let removedAny = false;

    for (let k = 0; k < expressionNode.children.length; k++) {
        if (remove[k]) {
            removedAny = true;
            if (history) expressionNode.children[k].mark = { marked: true, type: 'Absorption Law' };
        } else {
            newChildren.push(expressionNode.children[k]);
        }
    }

    return newChildren;
}

/**
 * Top down recursive application of the absorption law on a given expression tree.
 * Uses the n-ary operator node.
 *
 * 1. A + AB = A
 * 2. A(A + B) = A (same as 1., with the roles of the operators + and * reversed)
 */
export function absorptionLaw(
    expressionNode: ExpressionNode,
    absorptionOperator: string = "+",
    absorptionWithOperator: string = "*",
    history?: ExpressionTreeHistory
): ExpressionNode {

    if (expressionNode instanceof LeafNode) return expressionNode;

    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = absorptionLaw(
            expressionNode.left,
            absorptionOperator,
            absorptionWithOperator,
            history
        );
        return expressionNode;
    }

    /* Absorption Operator found */
    if (expressionNode instanceof NaryOperatorNode) {
        if (expressionNode.operator === absorptionOperator) {
            
            /** Perform removal step */
            const newChildren = removalStep(
                expressionNode,
                absorptionOperator,
                absorptionWithOperator,
                history
            );
            
            /* Snapshot if removal step changed anything, and history is provided */
            if (history && newChildren.length < expressionNode.children.length) {
                history.snapshot(expressionNode);
            }
            
            /* If absorption law only left one child, return that child directly */
            if (newChildren.length === 1) {
                if (history && expressionNode.root) {
                    newChildren[0].root = true;
                }
                return newChildren[0];
            
            /**
             * 
             */
            } else {
                // only already modify the children, if its important
                // for the history mark capturing
                if (history) expressionNode.children = newChildren;
                expressionNode.children = associativityLawChildren(
                    newChildren.map(child =>
                        absorptionLaw(
                            child,
                            absorptionOperator,
                            absorptionWithOperator,
                            history
                        )
                    ),
                    expressionNode.operator
                );
                return expressionNode;
            }
            
        } else {
            expressionNode.children = associativityLawChildren(
                expressionNode.children.map(child =>
                    absorptionLaw(
                        child,
                        absorptionOperator,
                        absorptionWithOperator,
                        history
                    )
                ),
                expressionNode.operator
            );
            return expressionNode;
        }
    }
}