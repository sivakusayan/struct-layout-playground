type Type = PrimitiveType | PointerType | ArrayType | StructureType
const enum TypeKind {
    PRIMITIVE,
    POINTER,
    ARRAY,
    STRUCTURE,
}
type PrimitiveType = {
    kind: TypeKind.PRIMITIVE
    typeId: number
}
type PointerType = {
    kind: TypeKind.POINTER
    pointeeType: Type
}
type ArrayType = {
    kind: TypeKind.ARRAY
    length: number
    arrayItemType: Type
}
type StructureType = {
    kind: TypeKind.STRUCTURE
    structure: Structure
}
type StructureMember = {
    name: string
    type: Type
    alignmentOverride: number | null
}
type Structure = {
    name: string | null
    members: StructureMember[]
}

const enum AnalyzeErrorCode {
    INVALID_CODE,
    MAX_DEPTH_REACHED,
}
type AnalyzeError = {
    error: AnalyzeErrorCode
    errorMessage: string | null
    line: number | null
}
type AnalyzeResult = {
    optimizedStructure: Structure
    optimizedDataSize: number
    optimizedSize: number
}

export const analyze = (code: string): AnalyzeResult | AnalyzeError => {
    console.log(code)
    return {
        error: AnalyzeErrorCode.INVALID_CODE,
        errorMessage: null,
        line: null,
    }
}
