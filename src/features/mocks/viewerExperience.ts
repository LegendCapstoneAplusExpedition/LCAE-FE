export type ReplayHighlight = {
  time: string;
  title: string;
  sub: string;
};

export type ReplayRecapStat = {
  label: string;
  value: string;
  sub?: string;
};

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
  '다시듣기 · 8',
];

export const replayDetail = {
  title: '커리어 전환의 모든 것',
  meta: '김멘토 · 42분 · 다시듣기',
  currentTime: '08:24',
  totalTime: '42:00',
};

export const replayRecap = {
  title: '라이브가 종료되었어요',
  meta: '커리어 전환의 모든 것 · 42분',
};

export const replayRecapStats: ReplayRecapStat[] = [
  { label: '총 청취자', value: '124명', sub: '+18 신규' },
  { label: '평균 청취', value: '36분' },
  { label: '댓글', value: '58' },
];

export const replayHighlights: ReplayHighlight[] = [
  {
    time: '08:24',
    title: '이직 시기는 어떻게 정해야 하나요?',
    sub: '멘티1의 질문',
  },
  {
    time: '18:51',
    title: '연봉 협상 실전 팁 정리',
    sub: '핀된 답변',
  },
  {
    time: '33:02',
    title: '포트폴리오에 꼭 들어가야 할 3가지',
    sub: '저장 12회',
  },
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
