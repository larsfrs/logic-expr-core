import { describe, expect, it } from 'vitest';
import { treeCanonicalForm } from '../../src/expressionTree/naryTree.js';
import { toDNF, toExpandedDNF, toNNF } from '../../src/transformations/transformations.js';
import { inputData } from '../../test/transformations/globalTestCases.js';


describe('test transformation', () => {

    it.each(inputData)('should apply nnf transformation to $description',
        ({input, nnf}) => {
            const result = toNNF(input, false).history.getLastVersion();
            expect(treeCanonicalForm(result)).toEqual(treeCanonicalForm(nnf));
    });

    it.each(inputData)('should apply dnf transformation to $description',
        ({input, dnf}) => {
            const result = toDNF(input).history.getLastVersion();
            expect(treeCanonicalForm(result)).toEqual(treeCanonicalForm(dnf));
    });

    it.each(inputData)('should apply expanded dnf transformation to $description',
        ({input, expandedDnf}) => {
            const result = toExpandedDNF(input).history.getLastVersion();
            expect(treeCanonicalForm(result)).toEqual(treeCanonicalForm(expandedDnf));
    });
    
});