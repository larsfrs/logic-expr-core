import { describe, expect, it } from 'vitest';
import { treeCanonicalForm } from '../../src/expressionTree/naryTree.js';
import { toDNF, toExpandedDNF, toNNF } from '../../src/transformations/transformations.js';
import { inputData } from '../../test/transformations/globalTestCases.js';


describe('test transformation', () => {

    it.each(inputData)('should apply nnf transformation to $description',
        ({input, nnf}) => {
            const result = toNNF(input, false).expressionNode;
            expect(treeCanonicalForm(result)).toEqual(treeCanonicalForm(nnf));
    });

    it.each(inputData)('should apply dnf transformation to $description',
        ({input, dnf}) => {
            const result = toDNF(input).expressionNode;
            expect(treeCanonicalForm(result)).toEqual(treeCanonicalForm(dnf));
    });

    /**
     * Sometimes variables get lost before the expanding dnf step. Which then reuslts
     * in them not bein added back in the expanded dnf step.
     * To avoid that, we pass in the full set of variables to the toExpandedDNF function.
     */
    it.each(inputData)('should apply expanded dnf transformation to $description',
        ({input, expandedDnf, variables}) => {
            const result = toExpandedDNF(input, variables).expressionNode;
            expect(treeCanonicalForm(result)).toEqual(treeCanonicalForm(expandedDnf));
    });
    
});