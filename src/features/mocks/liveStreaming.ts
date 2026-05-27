export type LiveQuestionItem = {
  id: string;
  name: string;
  body: string;
  likes: number;
  time?: string;
};

export const liveStreamingSession = {
  mentorName: '김멘토',
  title: '커리어 전환의 모든 것',
  liveTime: '10:24',
  viewerCount: 24,
};

export const liveStreamingPinnedQuestion: LiveQuestionItem = {
  id: 'pinned-question',
  name: '멘티1',
  body: '이직 시기는 어떻게 정해야 하나요?',
  likes: 12,
  time: '08:24',
};

export const liveStreamingQuestions: LiveQuestionItem[] = [
  liveStreamingPinnedQuestion,
  {
    id: 'question-2',
    name: '멘티6',
    body: '비전공자 포트폴리오는 어느 정도까지 준비해야 하나요?',
    likes: 9,
    time: '09:12',
  },
  {
    id: 'question-3',
    name: '멘티3',
    body: '면접에서 프로젝트 설명을 짧게 하는 방법이 궁금해요.',
    likes: 6,
    time: '10:01',
  },
];
