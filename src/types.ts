export type TypeName = {
    tag: "type_name",
    name: string,
};

export type Str = {
    tag: "str",
};

export type I32 = {
    tag: "i32",
};

export type U32 = {
    tag: "u32",
};

export type Bool = {
    tag: "bool",
};

export type Json = {
    tag: "json",
};

export type I64 = {
    tag: "i64",
};

export type F32 = {
    tag: "f32",
};

export type F64 = {
    tag: "f64",
};

export type PrimitiveType = Str | I32 | U32 | Bool | Json | I64 | F32 | F64;
export type TypeLiteral = TypeName | PrimitiveType;

export type NullableType = {
    tag: "nullable",
    type: Type,
};

export type OptionType = {
    tag: "option",
    type: Type,
};

export type VecType = {
    tag: "vec",
    type: Type,
};

export type HashMapType = {
    tag: "hash_map",
    key_type: PrimitiveType,
    value_type: Type,
};

export type HashSetType = {
    tag: "hash_set",
    type: Type,
};

export type Type = TypeLiteral | NullableType | OptionType | VecType | HashMapType | HashSetType;

export type Field = {
    tag: "field",
    name: string,
    type: Type,
};

export type TypeAlias = {
    tag: "alias",
    name: string,
    type: Type,
};

export type Struct = {
    tag: "struct",
    name: string,
    fields: Field[],
};

export type StringEnum = {
    tag: "string_enum",
    name: string,
    options: string[],
};

export type IntEnum = {
    tag: "int_enum",
    name: string,
    options: [string, number][],
};

export type StructUnion = {
    tag: "struct_union",
    name: string,
    variants: Struct[];
};

export type TupleUnionVariant = {
    tag: "tuple_union_variant",
    name: string,
    type: Type,
};

export type TupleUnion = {
    tag: "tuple_union",
    name: string,
    variants: TupleUnionVariant[],
};

export type TypeDeclaration = TypeAlias | Struct | StringEnum | IntEnum | StructUnion | TupleUnion;

export function StructUnion(name: string | TypeName, variants: Struct[]): StructUnion {
    return {
        tag: "struct_union",
        name: (typeof name == "string" ? name : name.name),
        variants: variants,
    };
}

export function Struct(name: string | TypeName, fields: Field[]): Struct {
    return {
        tag: "struct",
        name: (typeof name == "string" ? name : name.name),
        fields: fields,
    };
}

export function Field(name: string, type: Type): Field {
    return {
        tag: "field",
        name: name,
        type: type,
    };
}

export let Str: Str = {
    tag: "str",
};

export let I32: I32 = {
    tag: "i32",
};

export let U32: U32 = {
    tag: "u32",
};

export let I64: I64 = {
    tag: "i64",
};

export let Bool: Bool = {
    tag: "bool",
};

export let Json: Json = {
    tag: "json",
};

export let F32: F32 = {
    tag: "f32",
};

export let F64: F64 = {
    tag: "f64",
};


export function T(name: string): TypeName {
    return {
        tag: "type_name",
        name: name,
    };
}

export function Vec(t: Type): VecType {
    return {
        tag: "vec",
        type: t,
    };
}

export function HashMap(key_type: PrimitiveType, value_type: Type): HashMapType {
    return {
        tag: "hash_map",
        key_type: key_type,
        value_type: value_type,
    };
}

export function HashSet(type: Type): HashSetType {
    return {
        tag: "hash_set",
        type,
    };
}

export function Nullable(t: Type): NullableType {
    return {
        tag: "nullable",
        type: t,
    };
}

export function Optional(t: Type): OptionType {
    return {
        tag: "option",
        type: t,
    };
}

export function TypeAlias(name: string | TypeName, t: Type): TypeAlias {
    return {
        tag: "alias",
        name: (typeof name === "string" ? name : name.name),
        type: t,
    };
}

export function StringEnum(name: string | TypeName, options: string[]): StringEnum {
    return {
        tag: "string_enum",
        name: (typeof name === "string" ? name : name.name),
        options: options,
    };
}

export function TupleUnionVariant(name: string, type: Type): TupleUnionVariant {
    return {
        tag: "tuple_union_variant",
        name: name,
        type: type,
    };
}

export function TupleUnion(name: string | TypeName, variants: TupleUnionVariant[]): TupleUnion {
    return {
        tag: "tuple_union",
        name: (typeof name === "string" ? name : name.name),
        variants: variants,
    };
}
