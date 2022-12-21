import { Field, Struct, Type, TypeDeclaration } from '../types';

export function render_type(t: Type, type_namespace?: string): string {
    let result = "ERROR";
    type_namespace = type_namespace || "";

    switch (t.tag) {
        case "str":
            result = "string";
            break;
        case "i32":
            result = "number";
            break;
        case "u32":
            result = "number";
            break;
        case "f32":
            result = "number";
            break;
        case "f64":
            result = "number";
            break;
        case "bool":
            result = "boolean";
            break;
        case "json":
            result = "any";
            break;
        case "type_name":
            result = type_namespace ? type_namespace+t.name : t.name;
            break;
        case "vec":
            result = `${render_type(t.type, type_namespace)}[]`;
            break;
        case "option":
            result = `${render_type(t.type, type_namespace)}`;
            break;
        case "nullable":
            result = `${render_type(t.type, type_namespace)} | null`;
            break;
        case "hash_map":
            if (t.value_type.tag == "option") {
                result = `{[key: ${render_type(t.key_type,type_namespace)}]: ${render_type(t.value_type,type_namespace)} | null }`;
            } else {
                result = `{[key: ${render_type(t.key_type,type_namespace)}]: ${render_type(t.value_type,type_namespace)}}`;
            }
            break;
        default:
            throw `render_type not implemented for ${t.tag}`;
    }

    return result;
}


function render_struct_field(f: Field): string {
    switch (f.type.tag) {
        case "option":
            if(f.type.type.tag == "option") {
                return `${f.name}?: ${render_type(f.type)} | null`;
            } else {
                return `${f.name}?: ${render_type(f.type)}`;
            }
        default:
            return `${f.name}: ${render_type(f.type)}`;
    }
}

function gen_variant(prefix: string, s: Struct): string {
    return `export type ${prefix}${s.name} = {\n    type: "${s.name}",\n    ${s.fields.map(render_struct_field).join(",\n    ")}\n}`;
}

function gen_struct(s: Struct): string {
    return `export type ${s.name} = {\n    ${s.fields.map(render_struct_field).join(",\n    ")}\n}`;
}

function tuple_union_variant(variant: { name: string, type: Type; }): string {
    return `{ type: "${variant.name}"} & ${render_type(variant.type)}`;
}

export function gen_type_declaration(decl: TypeDeclaration): string {
    switch (decl.tag) {
        case "alias":
            return `export type ${decl.name} = ${render_type(decl.type)}`;

        case "struct_union":
            return `export type ${decl.name} = ${decl.variants.map((variant) => decl.name + variant.name).join(" | ")}\n\n${decl.variants.map((variant) => gen_variant(decl.name, variant)).join("\n\n")}`;

        case "tuple_union":
            return `export type ${decl.name} = ${decl.variants.map(tuple_union_variant).join(" | ")}`; // TODO //`export type ${decl.name} = ${decl.variants.map((variant) => decl.name + variant.name).join(" | ")}\n\n${decl.variants.map((variant) => gen_variant(decl.name, variant)).join("\n\n")}`;    

        case "struct":
            return gen_struct(decl);

        case "string_enum":
            return `export type ${decl.name} =\n    ${decl.options.map((v) => `"${v}"`).join("\n    | ")}\n
export enum ${decl.name}Options {\n    ${decl.options.map((v) => `${v} = "${v}"`).join(",\n    ")}\n}\n`;

        case "int_enum":
            return `export enum ${decl.name} {\n    ${decl.options.map(([v, n]) => `${v} = ${n}`).join(",\n    ")}\n}\n`;

        default:
            throw "gen_type_declaration not implemented!";
    }
}
