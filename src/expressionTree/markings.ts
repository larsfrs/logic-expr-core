export const markingTypes = [
    'Distributive Law',
    'Idempotency Law',
    'DeMorgan\'s Law',
    'Absorption Law',
    'Identity Law',
    'Complement Law',
    'Associativity Law',
    'Commutativity Law',
    'Double Negation Law',
    'Dominant Law',
] as const;

// katex color names
export const lightColorGroups = [
    'lightsteelblue',
    'palegreen',
    'thistle',
    'peachpuff',
    'gray',
    'steelblue',
    'green',
    'orchid',
    'darkorange',
    'dimgray'
] as const;

export const darkColorGroups = [
    '#334155', // slate-800
    '#374151', // gray-800
    '#4b5563', // gray-700
    '#1e293b', // slate-900
    '#475569', // slate-700
    '#0f172a', // navy/blue-black
    '#365314', // olive/dark green
    '#7c3aed', // muted purple
    '#78350f', // muted brown
    '#be185d', // muted magenta
] as const;


export const colorMapping: Record<typeof markingTypes[number], { light: typeof lightColorGroups[number], dark: typeof darkColorGroups[number] }> = {
    'Distributive Law': { light: 'lightsteelblue', dark: '#334155' },
    'Idempotency Law': { light: 'palegreen', dark: '#374151' },
    'DeMorgan\'s Law': { light: 'thistle', dark: '#4b5563' },
    'Absorption Law': { light: 'peachpuff', dark: '#1e293b' },
    'Identity Law': { light: 'gray', dark: '#475569' },
    'Complement Law': { light: 'steelblue', dark: '#0f172a' },
    'Associativity Law': { light: 'green', dark: '#365314' },
    'Commutativity Law': { light: 'orchid', dark: '#7c3aed' },
    'Double Negation Law': { light: 'darkorange', dark: '#78350f' },
    'Dominant Law': { light: 'dimgray', dark: '#be185d' },
};

/**
 * Markings are used to highlight parts of the expression tree
 * that have been modified by a transformation. They are purely for 
 * visualization purposes and not used in any logic operations.
 * A marking can be either unmarked, or marked with a type and colorGroup.
 */
export type Marking =
  | { 
        marked: false;
        type?: never;
        colorGroup?: never
    }
  | { 
        marked: true;
        type: typeof markingTypes[number];
    };

export const defaultMarking: Marking = { marked: false };

