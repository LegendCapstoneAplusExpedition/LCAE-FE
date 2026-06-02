export type LiveSession = {
  createdAt?: string;
  id: string;
  tags: string[];
  title: string;
  free: boolean;
  mentor: string;
  viewers: number;
};

export type MentorPost = {
  id: string;
  mentor: string;
  time: string;
  body: string;
  likes: number;
  comments: number;
};

export const liveSessions: LiveSession[] = [
  {
    id: 'live-1',
    tags: ['업무/업계', '라이브 멘토링 10회'],
    title: '개발자 취업 및 커리어 상담',
    free: true,
    mentor: '직군 백엔드 개발자 3년차',
    viewers: 24,
  },
  {
    id: 'live-2',
    tags: ['업계/업무'],
    title: '개발자 커리어 상담',
    free: false,
    mentor: '프론트엔드 개발자 8년차',
    viewers: 6,
  },
  {
    id: 'live-3',
    tags: ['커리어/업무'],
    title: '개발자 취업 및 커리어 상담',
    free: true,
    mentor: '게임 서버 개발자 12년차',
    viewers: 13,
  },
];

export const subscribedMentors = [
  {
    name: '김멘토',
    title: '커리어 전환의 모든 것',
    role: '백엔드 개발자 · 10년차',
    viewers: 24,
    live: true,
  },
  {
    name: '이멘토',
    title: '신입 개발자 Q&A',
    role: '프론트엔드 개발자 · 6년차',
    viewers: 11,
    live: true,
  },
  {
    name: '박멘토',
    title: 'PM 멘토링',
    role: 'PM · 12년차',
    viewers: 8,
    live: true,
  },
  {
    name: '최멘토',
    title: '디자이너 · 8년차',
    role: '디자이너 · 8년차',
    viewers: 0,
    live: false,
  },
];

export const mentorPosts: MentorPost[] = [
  {
    id: 'post-1',
    mentor: '김멘토',
    time: '20YY MM DD',
    body: '안녕하세요 여러분 내일은 AI 개발자로 취업하기 위한 포트폴리오에 대해서 이야기 해볼거에요.\n추가적인 질문사항이나 궁금한점이 있으시면 댓글로 질문해주세요!',
    likes: 24,
    comments: 8,
  },
  {
    id: 'post-2',
    mentor: '김멘토',
    time: '20YY MM DD',
    body: '이번 주 라이브는 이력서 첨삭으로 진행할게요. PDF 첨부 부탁드립니다.',
    likes: 11,
    comments: 3,
  },
];
