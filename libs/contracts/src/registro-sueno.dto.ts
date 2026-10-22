export interface RegistroSuenoDto {
  clientId: string;
  horaAcostarse: string;
  horaDespertar: string;
  latenciaMin: number;
  despertares: number;
  calidadPercibida: number;
  fatigaPercibida: number;
  esDiaLaboral: boolean;
  luzMatutinaMin: number;
  fecha?: string;
  updatedAt?: string;
}
