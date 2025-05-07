export interface EditarClienteDTO {

  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  historialMedico?: string;
  peso?: number;
  telefonos: string[];
}
