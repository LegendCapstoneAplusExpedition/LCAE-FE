export type BoardComment = {
  id: string;
  author: string;
  body: string;
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

export const postComposeAuthor = {
  name: '김멘토',
  meta: '20YY MM DD · 공개',
};

export const postComposeToolbarItems = ['▧', '⌁', '▥'];
