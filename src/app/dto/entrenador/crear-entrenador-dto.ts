export interface CrearEntrenadorDTO {

    usuarioId: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento: string;
  sexo: string;
  email: string;
  telefonos: string[];
  codCiudad: string;
  historialMedico?: string;
  peso?: number;
  altura?: number;
  password: string;


}
