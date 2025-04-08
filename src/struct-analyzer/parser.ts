type Type = PrimitiveType | PointerType | ArrayType | StructureType;
const enum TypeKind {
    PRIMITIVE,
    POINTER,
    ARRAY,
    STRUCTURE,
}
type PrimitiveType = {
    kind: TypeKind.PRIMITIVE;
    typeId: number;
};
type PointerType = {
    kind: TypeKind.POINTER;
    pointeeType: Type;
};
type ArrayType = {
    kind: TypeKind.ARRAY;
    length: number;
    arrayItemType: Type;
};
type StructureType = {
    kind: TypeKind.STRUCTURE;
    structure: Structure;
};
type StructureMember = {
    name: string;
    type: Type;
    alignmentOverride: number | null;
};
export type Structure = {
    name: string | null;
    members: StructureMember[];
};

export const enum ParseErrorCode {
    ERROR_SYNTAX,
    ERROR_MISSING_DECLARATION,
    ERROR_NO_STRUCTURES,
    ERROR_NO_STRUCTURES_TO_ANALYZE,
    ERROR_TOO_MANY_STRUCTURES_TO_ANALYZE,
    ERROR_ANONYMOUS_STRUCTURE_MARKED_FOR_ANALYSIS,
}
export type ParseError = {
    error: ParseErrorCode;
    errorMessage: string;
    lineNumber?: number;
};
type ParseResult = {
    structureToAnalyze: string;
    structures: Structure[];
};

export const isParseError = (object: any): object is ParseError => {
    const obj = object as ParseError;
    return obj.error !== undefined && obj.errorMessage !== undefined;
};

export const parse = (code: string): ParseResult | ParseError => {
    const lines = code.split('\n');
    let currentLineNumber = 0;
    const structures = [];
    const structuresMarkedForAnalysis = [];

    while (true) {
        const result = getNextStructure(lines, currentLineNumber);
        if (!result) break;
        if (isParseError(result)) return result;

        structures.push(result.structure);
        currentLineNumber = result.nextLine;
        if (result.shouldAnalyzeStructure) {
            structuresMarkedForAnalysis.push(result.structure);
        }
    }

    if (structures.length === 0) {
        return {
            error: ParseErrorCode.ERROR_NO_STRUCTURES,
            errorMessage: 'At least one structure must be present.',
        };
    }

    if (structuresMarkedForAnalysis.length === 0) {
        return {
            error: ParseErrorCode.ERROR_NO_STRUCTURES_TO_ANALYZE,
            errorMessage: 'At least one structure must be marked for analysis.',
        };
    }

    if (structuresMarkedForAnalysis.length > 1) {
        return {
            error: ParseErrorCode.ERROR_TOO_MANY_STRUCTURES_TO_ANALYZE,
            errorMessage: 'At most one structure can be marked for analysis.',
        };
    }

    if (!structuresMarkedForAnalysis[0].name) {
        return {
            error: ParseErrorCode.ERROR_ANONYMOUS_STRUCTURE_MARKED_FOR_ANALYSIS,
            errorMessage: 'Only named structures can be marked for analysis.',
        };
    }

    return {
        structureToAnalyze: structuresMarkedForAnalysis[0].name,
        structures,
    };
};

type GetNextStructureResult = {
    structure: Structure;
    shouldAnalyzeStructure: boolean;
    nextLine: number;
};
const getNextStructure = (
    lines: string[],
    lineNumber: number
): GetNextStructureResult | ParseError | null => {
    let structStartIndex = -1;
    for (let i = lineNumber; i < lines.length; i++) {
        if (lines[i].trim().startsWith('struct')) {
            structStartIndex = i;
            break;
        }
    }
    if (structStartIndex === -1) return null;

    let parsedStructLine = lines[structStartIndex]
        .split(' ')
        .map((token) => token.trim());
    let structName;
    if (parsedStructLine[1] !== '{') {
        structName = parsedStructLine[1];
    }

    return null;
};
