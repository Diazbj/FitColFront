import { ejercicioRutinaDTO } from "./ejercicio-rutinadto";

export interface crearRutinaCompletaDTO {

  nombre: string;
  codPlanEntrenamiento: number;
  ejercicios: ejercicioRutinaDTO[];
}
