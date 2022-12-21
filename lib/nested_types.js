"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten_type_declaration = exports.flatten_struct = exports.flatten_fields = exports.flatten_type = exports.NStruct = exports.NField = exports.NOptionalal = exports.NHashMap = exports.NVec = void 0;
const t = __importStar(require("./types"));
function NVec(t) {
    return {
        tag: "nested_vec",
        type: t,
    };
}
exports.NVec = NVec;
function NHashMap(key_type, value_type) {
    return {
        tag: "nested_hash_map",
        key_type: key_type,
        value_type: value_type,
    };
}
exports.NHashMap = NHashMap;
function NOptionalal(t) {
    return {
        tag: "nested_option",
        type: t,
    };
}
exports.NOptionalal = NOptionalal;
function NField(name, type) {
    return {
        tag: "nested_field",
        name: name,
        type: type,
    };
}
exports.NField = NField;
function NStruct(name, fields) {
    return {
        tag: "nested_struct",
        name: (typeof name === "string" ? name : name.name),
        fields: fields,
    };
}
exports.NStruct = NStruct;
function flatten_type(prefix, type) {
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
exports.flatten_type = flatten_type;
function flatten_fields(prefix, field) {
    let type_declarations = [];
    let fields = [];
    for (let f of field) {
        let [td, type] = flatten_type(prefix, f.type);
        fields.push(t.Field(f.name, type));
        type_declarations = [...type_declarations, ...td];
    }
    return [type_declarations, fields];
}
exports.flatten_fields = flatten_fields;
function flatten_struct(s) {
    let [td, fields] = flatten_fields(s.name, s.fields);
    return [
        ...td,
        t.Struct(s.name, fields)
    ];
}
exports.flatten_struct = flatten_struct;
function flatten_type_declaration(decl) {
    if (decl.tag == "nested_struct") {
        return flatten_struct(decl);
    }
    return [decl];
}
exports.flatten_type_declaration = flatten_type_declaration;
