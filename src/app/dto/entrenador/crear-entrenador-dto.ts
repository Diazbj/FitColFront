export interface CrearEntrenadorDTO {

    usuarioId: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento: string;
  email: string;
  telefonos: string[];
  password: string;
  aniosExp?: number;
}
