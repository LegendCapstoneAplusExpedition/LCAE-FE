export type MentorProfile = {
  name: string;
  subtitle: string;
  subscriberText: string;
};

export type BoardComment = {
  id: string;
  author: string;
  body: string;
};

export const mentorProfile: MentorProfile = {
  name: '김멘토',
  subtitle: '10년 이상의 업계 경험을 바탕으로',
  subscriberText: '구독자 1,284명',
};

export const mentorBoardSummary = {
  postCount: 12,
  sortLabel: '최신순',
};

export const boardComments: BoardComment[] = [
  {
    id: 'comment-1',
    author: '멘티1',
    body: '안녕하세요 이직할 때 가장 중요한 건 뭔가요?',
  },
  {
    id: 'comment-2',
    author: '멘티2',
    body: 'AI 개발자가 되기 위해 가장 필요한 준비가 뭔가요?',
  },
  {
    id: 'comment-3',
    author: '멘티3',
    body: '연봉 협상에서 조심해야 할 점은?',
  },
  {
    id: 'comment-4',
    author: '멘티4',
    body: '포트폴리오가 뭔가요?',
  },
];

export const livePrepareDraft = {
  titlePlaceholder: '방송 제목을 입력하세요',
  titleMaxLength: 40,
};

export const livePrepareCategories = ['업무', '일상', '보상', '성장', '커리어'];

export const livePrepareActiveCategory = '커리어';

export const postComposeAuthor = {
  name: '김멘토',
  meta: '20YY MM DD · 공개',
};

export const postComposeToolbarItems = ['▧', '⌁', '▥'];
