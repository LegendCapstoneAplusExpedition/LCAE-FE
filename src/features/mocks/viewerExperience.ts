export type MenuItem = {
  label: string;
  right?: string;
};

export const liveCategoryFilters = [
  '전체',
  '업무',
  '일상',
  '보상',
  '성장',
  '커리어',
];

export const myLiveTabs = ['구독 멘토', '예정 라이브', '최근 청취'];

export const searchFilterChips = [
  '전체 · 18',
  '라이브 · 3',
  '멘토 · 7',
];

export const myPageProfile = {
  name: '카풀링',
  roleLabel: '멘티',
  editLabel: '프로필 편집 ›',
} as const;

export const myPageStats = [
  { label: '내 카풀', value: '3' },
  { label: '예약', value: '1' },
  { label: '리뷰', value: '8' },
];

export const myPageMenu: MenuItem[] = [
  { label: '구독 중인 멘토', right: '12명' },
  { label: '예약 내역', right: '1건' },
  { label: '작성한 리뷰', right: '8개' },
  { label: '알림 설정' },
];
