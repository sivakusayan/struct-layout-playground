export type Type = PrimitiveType | PointerType | ArrayType | StructureType;
type PrimitiveType = {
    kind: "PRIMITIVE";
    typeId: number;
};
type PointerType = {
    kind: "POINTER";
    pointeeType: Type;
};
type ArrayType = {
    kind: "ARRAY";
    length: number;
    arrayItemType: Type;
};
type StructureType = {
    kind: "STRUCTURE";
    structure: Structure
}
type StructureMember = {
    name: string;
    type: Type;
    alignmentOverride: number | null;
};
type Structure = {
    name: string | null;
    members: StructureMember[];
};
