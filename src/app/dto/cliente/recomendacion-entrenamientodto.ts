export interface RecomendacionEntrenamientoDTO {
  usuarioId: string;
  nombreCompleto: string;
  fechaNacimiento: string; // o Date si haces transformación
  edad: number;
  planesRecomendados: string; // o string[] si lo transformas a lista
}