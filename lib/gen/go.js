"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gen_type_declaration = exports.render_type = void 0;
const utils_1 = require("../utils");
function render_type(t, type_namespace) {
    let result = "ERROR";
    switch (t.tag) {
        case "str":
            result = "string";
            break;
        case "i32":
            result = "int32";
            break;
        case "u32":
            result = "uint32";
            break;
        case "f32":
            result = "float32";
            break;
        case "i64":
            result = "int64";
            break;
        case "f64":
            result = "float64";
            break;
        case "bool":
            result = "bool";
            break;
        case "json":
            result = "[]byte";
            break;
        case "type_name":
            result = type_namespace ? type_namespace + t.name : t.name;
            break;
        case "vec":
            result = `[]${render_type(t.type, type_namespace)}`;
            break;
        case "nullable":
            result = `*${render_type(t.type, type_namespace)}`;
            break;
        case "option":
            // TODO: OPTION TYPE
            throw "option not implemented for go!";
        /*result = `*${render_type(t.type, type_namespace)}`;
        break;*/
        case "hash_map":
            result = `map[${render_type(t.key_type, type_namespace)}]${render_type(t.value_type, type_namespace)}`;
            break;
        case "hash_set":
            result = `map[${render_type(t.type, type_namespace)}]bool`;
            break;
        default:
            throw `render_type not implemented`;
    }
    return result;
}
exports.render_type = render_type;
function render_struct_field(f, kind) {
    if (kind == "json") {
        return `${(0, utils_1.to_pascal_case)(f.name)} ${render_type(f.type)} \`json:"${f.name}${f.type.tag == "option" ? ",omitempty" : ""}"\``;
    }
    else {
        return `${(0, utils_1.to_pascal_case)(f.name)} ${render_type(f.type)} \`schema:"${f.name}"\``;
    }
}
function gen_struct_union_variant(name, variant, kind) {
    return `type ${name}${variant.name} struct {
    ${variant.fields.map(f => render_struct_field(f, kind)).join("\n    ")}
}`;
}
function gen_type_declaration(decl, kind) {
    let r = "";
    switch (decl.tag) {
        case "alias":
            r += `type ${decl.name} ${render_type(decl.type)}`;
            break;
        case "struct_union":
            r += `
type ${decl.name}Tag string

const (
    ${decl.variants.map((v, i) => `${decl.name}${(0, utils_1.to_pascal_case)(v.name)}Tag${i == 0 ? " " + decl.name + "Tag" : ""} = "${(0, utils_1.to_pascal_case)(v.name)}"`).join("\n    ")}
)

${decl.variants.map(v => gen_struct_union_variant(decl.name, v, kind)).join("\n")}

type ${decl.name} struct {
    Tag ${decl.name}Tag \`json:"type"\`
    ${decl.variants.map(v => `${(0, utils_1.to_pascal_case)(v.name)} *${decl.name}${(0, utils_1.to_pascal_case)(v.name)}`).join("\n    ")}
}
`;
            break;
        case "struct":
            r += `type ${decl.name} struct {\n    ${decl.fields.map(f => render_struct_field(f, kind)).join("\n    ")}\n}\n`;
            break;
        case "string_enum":
            r += `type ${decl.name} string\n\nconst (
    ${decl.options.map((v, i) => `${v.toUpperCase()}${i == 0 ? " " + decl.name : ""} = "${v}"`).join("\n    ")}
)\n`;
            break;
        case "int_enum":
            r += `type ${decl.name} int32\n\nconst (
    ${decl.options.map(([v, n], i) => `${v.toUpperCase()}${i == 0 ? " " + decl.name : ""} = ${n}`).join("\n    ")}
)\n`;
            break;
        default:
            throw "not implemented!";
    }
    return r;
}
exports.gen_type_declaration = gen_type_declaration;
