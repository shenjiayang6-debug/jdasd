export interface Prize {
  id: string;
  text: string;
  color: string;
}

export interface WheelConfig {
  prizes: Prize[];
  duration: number; // spin duration in seconds
  spinCount: number; // how many full rotations before stopping
}

export interface GeneratedPrizeResponse {
  prizes: string[];
}
