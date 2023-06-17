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

export enum PostCategory {
  CLOTHING_AND_ACCESSORIES = 'CLOTHING_AND_ACCESSORIES',
  ELETRONICS = 'ELETRONICS',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HOBBIES = 'HOBBIES',
  HOME = 'HOME',
}

export const PostCategoryTitles = new Map<PostCategory, string>([
  [PostCategory.CLOTHING_AND_ACCESSORIES, 'Clothing & Accessories'],
  [PostCategory.ELETRONICS, 'Eletronics'],
  [PostCategory.ENTERTAINMENT, 'Entertainment'],
  [PostCategory.HOBBIES, 'Hobbies'],
  [PostCategory.HOME, 'Home'],
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
