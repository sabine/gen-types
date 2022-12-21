import * as t from './types';

export type NestedType = t.Type | t.Struct | NestedHashMapType | NestedVecType | NestedOptionType | NestedStruct;

export type NestedOptionType = {
    tag: "nested_option",
    type: NestedType,
};

export type NestedVecType = {
    tag: "nested_vec",
    type: NestedType,
};

export type NestedHashMapType = {
    tag: "nested_hash_map",
    key_type: t.PrimitiveType,
    value_type: NestedType,
};

export function NVec(t: NestedType): NestedVecType {
    return {
        tag: "nested_vec",
        type: t,
    };
}

export function NHashMap(key_type: t.PrimitiveType, value_type: NestedType): NestedHashMapType {
    return {
        tag: "nested_hash_map",
        key_type: key_type,
        value_type: value_type,
    };
}

export function NOptionalal(t: NestedType): NestedOptionType {
    return {
        tag: "nested_option",
        type: t,
    };
}

export type NestedField = {
    tag: "nested_field",
    name: string,
    type: NestedType,
};

export function NField(name: string, type: NestedType): NestedField {
    return {
        tag: "nested_field",
        name: name,
        type: type,
    };
}
export type NestedStruct = {
    tag: "nested_struct",
    name: string,
    fields: NestedField[],
};

export function NStruct(name: string | t.TypeName, fields: NestedField[]): NestedStruct {
    return {
        tag: "nested_struct",
        name: (typeof name === "string" ? name : name.name),
        fields: fields,
    };
}


export function flatten_type(prefix: string, type: NestedType): [t.TypeDeclaration[], t.Type] {
    if (type.tag == "struct") {
        return [[t.Struct(`${prefix}${type.name}`, type.fields)], t.T(`${prefix}${type.name}`)];
    }
    if (type.tag == "nested_vec") {
        let [td, t_] = flatten_type(prefix, type.type);
        return [td, t.Vec(t_)];
    }
    if (type.tag == "nested_option") {
        let [td, t_] = flatten_type(prefix, type.type);
        return [td, t.Optional(t_)];
    }
    if (type.tag == "nested_hash_map") {
        let [td, t_] = flatten_type(prefix, type.value_type);
        return [td, t.HashMap(type.key_type, t_)];
    }
    if (type.tag == "nested_struct") {
        let struct_name = `${prefix}${type.name}`;
        let [td, fields] = flatten_fields(struct_name, type.fields);
        return [[...td,
            t.Struct(struct_name, fields)],
            t.T(struct_name)];
    }
    return [[], type];
}

export function flatten_fields(prefix: string, field: NestedField[]): [t.TypeDeclaration[], t.Field[]] {
    let type_declarations: t.TypeDeclaration[] = [];
    let fields: t.Field[] = [];

    for (let f of field) {
        let [td, type] = flatten_type(prefix, f.type);
        fields.push(t.Field(f.name, type));
        type_declarations = [...type_declarations, ...td];
    }

    return [type_declarations, fields];
}

export function flatten_struct(s: NestedStruct): t.TypeDeclaration[] {
    let [td, fields] = flatten_fields(s.name, s.fields);
    

    return [
        ...td,
        t.Struct(s.name, fields)
    ];
}

export type NestedTypeDeclaration = t.TypeDeclaration | NestedStruct;

export function flatten_type_declaration(decl: NestedTypeDeclaration): t.TypeDeclaration[] {
    if (decl.tag == "nested_struct") {
        return flatten_struct(decl);
    }
    return [decl];
}
