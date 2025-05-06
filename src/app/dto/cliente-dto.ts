export interface ClienteDTO {

    usuarioId: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  sexo: string;
  historialMedico?: string;
  edad: number;
  peso?: number;
  altura?: number;
  telefonos: string[];

}
