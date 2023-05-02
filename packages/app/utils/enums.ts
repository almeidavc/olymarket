export enum Zone {
  BUNGALOWS = 'BUNGALOWS',
  TOWER_A = 'TOWER_A',
  TOWER_B = 'TOWER_B',
}

export const ZoneTitles = new Map<Zone, string>([
  [Zone.BUNGALOWS, 'Bungalows'],
  [Zone.TOWER_A, 'Tower A'],
  [Zone.TOWER_B, 'Tower B'],
])
