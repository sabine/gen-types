import { Type, TypeDeclaration } from '../types';
export declare function render_type(t: Type, type_namespace?: string): string;
export declare function gen_type_declaration(decl: TypeDeclaration, derives: string[]): string;
export declare let DOUBLE_OPTION_SERIALIZE_DESERIALIZE: string;
export declare let NULLABLE_SERIALIZE_DESERIALIZE: string;
