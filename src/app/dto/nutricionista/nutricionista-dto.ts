export interface NutricionistaDTO {

    usuarioId: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  telefonos: string[];
  aniosExp?: number;

}
