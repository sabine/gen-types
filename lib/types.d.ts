export type TypeName = {
    tag: "type_name";
    name: string;
};
export type Str = {
    tag: "str";
};
export type I32 = {
    tag: "i32";
};
export type U32 = {
    tag: "u32";
};
export type Bool = {
    tag: "bool";
};
export type Json = {
    tag: "json";
};
export type I64 = {
    tag: "i64";
};
export type F32 = {
    tag: "f32";
};
export type F64 = {
    tag: "f64";
};
export type PrimitiveType = Str | I32 | U32 | Bool | Json | I64 | F32 | F64;
export type TypeLiteral = TypeName | PrimitiveType;
export type NullableType = {
    tag: "nullable";
    type: Type;
};
export type OptionType = {
    tag: "option";
    type: Type;
};
export type VecType = {
    tag: "vec";
    type: Type;
};
export type HashMapType = {
    tag: "hash_map";
    key_type: PrimitiveType;
    value_type: Type;
};
export type HashSetType = {
    tag: "hash_set";
    type: Type;
};
export type Type = TypeLiteral | NullableType | OptionType | VecType | HashMapType | HashSetType;
export type Field = {
    tag: "field";
    name: string;
    type: Type;
};
export type TypeAlias = {
    tag: "alias";
    name: string;
    type: Type;
};
export type Struct = {
    tag: "struct";
    name: string;
    fields: Field[];
};
export type StringEnum = {
    tag: "string_enum";
    name: string;
    options: string[];
};
export type IntEnum = {
    tag: "int_enum";
    name: string;
    options: [string, number][];
};
export type StructUnion = {
    tag: "struct_union";
    name: string;
    variants: Struct[];
};
export type TupleUnionVariant = {
    tag: "tuple_union_variant";
    name: string;
    type: Type;
};
export type TupleUnion = {
    tag: "tuple_union";
    name: string;
    variants: TupleUnionVariant[];
};
export type TypeDeclaration = TypeAlias | Struct | StringEnum | IntEnum | StructUnion | TupleUnion;
export declare function StructUnion(name: string | TypeName, variants: Struct[]): StructUnion;
export declare function Struct(name: string | TypeName, fields: Field[]): Struct;
export declare function Field(name: string, type: Type): Field;
export declare let Str: Str;
export declare let I32: I32;
export declare let U32: U32;
export declare let I64: I64;
export declare let Bool: Bool;
export declare let Json: Json;
export declare let F32: F32;
export declare let F64: F64;
export declare function T(name: string): TypeName;
export declare function Vec(t: Type): VecType;
export declare function HashMap(key_type: PrimitiveType, value_type: Type): HashMapType;
export declare function HashSet(type: Type): HashSetType;
export declare function Nullable(t: Type): NullableType;
export declare function Optional(t: Type): OptionType;
export declare function TypeAlias(name: string | TypeName, t: Type): TypeAlias;
export declare function StringEnum(name: string | TypeName, options: string[]): StringEnum;
export declare function TupleUnionVariant(name: string, type: Type): TupleUnionVariant;
export declare function TupleUnion(name: string | TypeName, variants: TupleUnionVariant[]): TupleUnion;
