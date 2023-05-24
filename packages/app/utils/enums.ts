import { Color } from 'app/components/tag'

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

export enum PostStatus {
  CREATED = 'CREATED',
  REMOVED = 'REMOVED',
  SOLD = 'SOLD',
}

export const PostStatusTitles = new Map<PostStatus, string>([
  [PostStatus.CREATED, 'created'],
  [PostStatus.REMOVED, 'removed'],
  [PostStatus.SOLD, 'sold'],
])

export const PostStatusColors = new Map<PostStatus, Color>([
  [PostStatus.REMOVED, 'red'],
  [PostStatus.SOLD, 'green'],
])
