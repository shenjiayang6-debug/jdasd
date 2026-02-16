import { Prize } from './types';

// Vibrant palette for wheel segments
export const SEGMENT_COLORS = [
  '#EF476F', // Red/Pink
  '#FFD166', // Yellow
  '#06D6A0', // Green
  '#118AB2', // Blue
  '#073B4C', // Dark Blue
  '#9D4EDD', // Purple
  '#FF9F1C', // Orange
  '#4CC9F0', // Light Blue
];

export const DEFAULT_PRIZES: Prize[] = [
  { id: '1', text: '谢谢惠顾', color: SEGMENT_COLORS[0] }, // User request
  { id: '2', text: '好运奖', color: SEGMENT_COLORS[1] },   // User request (corrected typo 将 -> 奖)
  { id: '3', text: '现金大奖', color: SEGMENT_COLORS[2] }, // Creative idea
  { id: '4', text: '倒霉奖', color: SEGMENT_COLORS[3] },   // User request
  { id: '5', text: '神秘大礼', color: SEGMENT_COLORS[4] }, // Creative idea
  { id: '6', text: '坏运奖', color: SEGMENT_COLORS[5] },   // User request
  { id: '7', text: '再来一次', color: SEGMENT_COLORS[6] }, // Creative idea
  { id: '8', text: '必须请客', color: SEGMENT_COLORS[7] }, // Creative idea (social consequence)
];

export const DEFAULT_THEMES = [
  "周末去哪玩",
  "今晚吃什么",
  "真心话大冒险",
  "家务分配",
  "公司年会抽奖",
  "健身挑战项目"
];
