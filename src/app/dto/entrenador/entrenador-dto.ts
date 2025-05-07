export interface EntrenadorDTO {

    usuarioId: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  sexo: string;
  historialMedico?: string;
  fechaNacimiento: string;
  peso?: number;
  altura?: number;
  telefonos: string[];
  ciudad: string;

}
