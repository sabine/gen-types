"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NULLABLE_SERIALIZE_DESERIALIZE = exports.DOUBLE_OPTION_SERIALIZE_DESERIALIZE = exports.gen_type_declaration = exports.render_type = void 0;
function render_type(t, type_namespace) {
    let result = "ERROR";
    switch (t.tag) {
        case "str":
            result = "String";
            break;
        case "i32":
            result = "i32";
            break;
        case "u32":
            result = "u32";
            break;
        case "f32":
            result = "f32";
            break;
        case "i64":
            result = "i64";
            break;
        case "f64":
            result = "f64";
            break;
        case "bool":
            result = "bool";
            break;
        case "json":
            result = "serde_json::Value";
            break;
        case "type_name":
            result = type_namespace ? type_namespace + t.name : t.name;
            break;
        case "vec":
            result = `Vec<${render_type(t.type, type_namespace)}>`;
            break;
        case "nullable":
            result = `Option<${render_type(t.type, type_namespace)}>`;
            break;
        case "option":
            result = `Option<${render_type(t.type, type_namespace)}>`;
            break;
        case "hash_map":
            result = `std::collections::HashMap<${render_type(t.key_type, type_namespace)},${render_type(t.value_type, type_namespace)}>`;
            break;
        case "hash_set":
            result = `std::collections::HashSet<${render_type(t.type, type_namespace)}>`;
            break;
        default:
            throw `render_type not implemented`;
    }
    return result;
}
exports.render_type = render_type;
function custom_serialize_deserialize_type(t, derives) {
    let serde_options = [];
    if (t.tag == "option") {
        if (derives.indexOf("Serialize") != -1) {
            serde_options.push(`skip_serializing_if = "Option::is_none"`);
        }
    }
    if (t.tag == "option" && t.type.tag == "option") {
        // NOTE: double options are never serialized by the api, that's why we just deserialize them
        // if this is a double option, serde needs to be told how to handle it: https://github.com/serde-rs/serde/issues/1042
        serde_options.push("default");
        if (derives.indexOf("Deserialize") != -1) {
            serde_options.push(`deserialize_with = "double_option"`);
        }
    }
    if (serde_options.length > 0) {
        return `#[serde(${serde_options.join(",")})]`;
    }
    return "";
}
function render_struct_field(f, derives) {
    return `${custom_serialize_deserialize_type(f.type, derives)}pub ${f.name}: ${render_type(f.type)}`;
}
function render_union_variant_field(f, derives) {
    return `${custom_serialize_deserialize_type(f.type, derives)}${f.name}: ${render_type(f.type)}`;
}
function render_tuple_union_variant_field(t, derives) {
    return `${custom_serialize_deserialize_type(t, derives)}${render_type(t)}`;
}
function gen_struct_union_variant(variant, derives) {
    if (variant.fields.length > 0) {
        return `${variant.name} {\n        ${variant.fields.map(f => render_union_variant_field(f, derives)).join(",\n        ")}\n    }`;
    }
    else {
        return variant.name;
    }
}
function gen_tuple_union_variant(variant, derives) {
    return `${variant.name} (${render_tuple_union_variant_field(variant.type, derives)})`;
}
function gen_type_declaration(decl, derives) {
    let r = "";
    if (derives && derives.length > 0 && decl.tag != "alias") {
        r = `#[derive(${derives.join(", ")})]\n`;
    }
    switch (decl.tag) {
        case "alias":
            r += `pub type ${decl.name} = ${render_type(decl.type)};`;
            break;
        case "struct_union":
            r += `#[serde(tag = "type")]\npub enum ${decl.name} {\n    ${decl.variants.map(v => gen_struct_union_variant(v, derives)).join(",\n    ")}\n}\n`;
            break;
        case "tuple_union":
            r += `#[serde(tag = "type")]\npub enum ${decl.name} {\n    ${decl.variants.map(v => gen_tuple_union_variant(v, derives)).join(",\n    ")}\n}\n`;
            break;
        case "struct":
            r += `pub struct ${decl.name} {\n    ${decl.fields.map(f => render_struct_field(f, derives)).join(",\n    ")}\n}\n`;
            break;
        case "string_enum":
            r += `pub enum ${decl.name} {\n    ${decl.options.map((v) => `${v}`).join(",\n    ")}\n}\n`;
            break;
        case "int_enum":
            // TODO: derive automatic conversion between i32 repr?
            r += `pub enum ${decl.name} {\n    ${decl.options.map(([v, n]) => `${v} = ${n}`).join(",\n    ")}\n}\n`;
            break;
        default:
            throw "not implemented!";
    }
    return r;
}
exports.gen_type_declaration = gen_type_declaration;
exports.DOUBLE_OPTION_SERIALIZE_DESERIALIZE = `pub fn double_option<'de, T, D>(de: D) -> Result<Option<Option<T>>, D::Error>
    where T: serde::Deserialize<'de>,
          D: serde::Deserializer<'de>
{
    Deserialize::deserialize(de).map(Some)
}

pub fn double_option_id_type<'de, D>(de: D) -> Result<Option<Option<i64>>, D::Error>
    where 
          D: serde::Deserializer<'de>
{
    let s: Option<&str> = serde::de::Deserialize::deserialize(de)?;

    match s {
        Some(string_id) => {
            from_id_type(string_id).map(Some).map_err(serde::de::Error::custom)
        }
        None => Ok(None),
    }.map(Some)
}`;
exports.NULLABLE_SERIALIZE_DESERIALIZE = `
#[derive(Debug)]
struct Nullable<T>(Option<T>); // wrapper struct

impl<T> core::ops::Deref for Nullable<T> {
    type Target = Option<T>; // Our wrapper struct will coerce into Option
    fn deref(&self) -> &Option<T> {
        &self.0 // We just extract the inner element
    }
}

impl<T: Serialize> Serialize for Nullable<T> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match &self.0 {
            Some(s) => serializer.serialize_some(s),
            None => serializer.serialize_none(),
        }
    }
}

impl<'de, T: Deserialize<'de>> Deserialize<'de> for Nullable<T> {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        Deserialize::deserialize(deserializer).map(|o: Option<T>| Nullable(o))
    }
}
`;
