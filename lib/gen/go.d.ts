import { Type, TypeDeclaration } from '../types';
export declare function render_type(t: Type, type_namespace?: string): string;
export type TypeDeclKind = "json" | "schema";
export declare function gen_type_declaration(decl: TypeDeclaration, kind: TypeDeclKind): string;
