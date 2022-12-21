"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleUnion = exports.TupleUnionVariant = exports.StringEnum = exports.TypeAlias = exports.Optional = exports.Nullable = exports.HashSet = exports.HashMap = exports.Vec = exports.T = exports.F64 = exports.F32 = exports.Json = exports.Bool = exports.I64 = exports.U32 = exports.I32 = exports.Str = exports.Field = exports.Struct = exports.StructUnion = void 0;
function StructUnion(name, variants) {
    return {
        tag: "struct_union",
        name: (typeof name == "string" ? name : name.name),
        variants: variants,
    };
}
exports.StructUnion = StructUnion;
function Struct(name, fields) {
    return {
        tag: "struct",
        name: (typeof name == "string" ? name : name.name),
        fields: fields,
    };
}
exports.Struct = Struct;
function Field(name, type) {
    return {
        tag: "field",
        name: name,
        type: type,
    };
}
exports.Field = Field;
exports.Str = {
    tag: "str",
};
exports.I32 = {
    tag: "i32",
};
exports.U32 = {
    tag: "u32",
};
exports.I64 = {
    tag: "i64",
};
exports.Bool = {
    tag: "bool",
};
exports.Json = {
    tag: "json",
};
exports.F32 = {
    tag: "f32",
};
exports.F64 = {
    tag: "f64",
};
function T(name) {
    return {
        tag: "type_name",
        name: name,
    };
}
exports.T = T;
function Vec(t) {
    return {
        tag: "vec",
        type: t,
    };
}
exports.Vec = Vec;
function HashMap(key_type, value_type) {
    return {
        tag: "hash_map",
        key_type: key_type,
        value_type: value_type,
    };
}
exports.HashMap = HashMap;
function HashSet(type) {
    return {
        tag: "hash_set",
        type,
    };
}
exports.HashSet = HashSet;
function Nullable(t) {
    return {
        tag: "nullable",
        type: t,
    };
}
exports.Nullable = Nullable;
function Optional(t) {
    return {
        tag: "option",
        type: t,
    };
}
exports.Optional = Optional;
function TypeAlias(name, t) {
    return {
        tag: "alias",
        name: (typeof name === "string" ? name : name.name),
        type: t,
    };
}
exports.TypeAlias = TypeAlias;
function StringEnum(name, options) {
    return {
        tag: "string_enum",
        name: (typeof name === "string" ? name : name.name),
        options: options,
    };
}
exports.StringEnum = StringEnum;
function TupleUnionVariant(name, type) {
    return {
        tag: "tuple_union_variant",
        name: name,
        type: type,
    };
}
exports.TupleUnionVariant = TupleUnionVariant;
function TupleUnion(name, variants) {
    return {
        tag: "tuple_union",
        name: (typeof name === "string" ? name : name.name),
        variants: variants,
    };
}
exports.TupleUnion = TupleUnion;
