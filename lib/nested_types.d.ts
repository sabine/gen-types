import * as t from './types';
export type NestedType = t.Type | t.Struct | NestedHashMapType | NestedVecType | NestedOptionType | NestedStruct;
export type NestedOptionType = {
    tag: "nested_option";
    type: NestedType;
};
export type NestedVecType = {
    tag: "nested_vec";
    type: NestedType;
};
export type NestedHashMapType = {
    tag: "nested_hash_map";
    key_type: t.PrimitiveType;
    value_type: NestedType;
};
export declare function NVec(t: NestedType): NestedVecType;
export declare function NHashMap(key_type: t.PrimitiveType, value_type: NestedType): NestedHashMapType;
export declare function NOptionalal(t: NestedType): NestedOptionType;
export type NestedField = {
    tag: "nested_field";
    name: string;
    type: NestedType;
};
export declare function NField(name: string, type: NestedType): NestedField;
export type NestedStruct = {
    tag: "nested_struct";
    name: string;
    fields: NestedField[];
};
export declare function NStruct(name: string | t.TypeName, fields: NestedField[]): NestedStruct;
export declare function flatten_type(prefix: string, type: NestedType): [t.TypeDeclaration[], t.Type];
export declare function flatten_fields(prefix: string, field: NestedField[]): [t.TypeDeclaration[], t.Field[]];
export declare function flatten_struct(s: NestedStruct): t.TypeDeclaration[];
export type NestedTypeDeclaration = t.TypeDeclaration | NestedStruct;
export declare function flatten_type_declaration(decl: NestedTypeDeclaration): t.TypeDeclaration[];
