import React from 'react';

import { PostComposeScreen } from '../../../screens/mentor/PostComposeScreen';
import {
  createBoardPost,
  fetchMentorBoard,
} from '../../../../services/api/users';

type Props = {
  mentorToken?: string | null;
  onBack?: () => void;
  onSubmit?: () => void;
};

const noop = () => undefined;

export function MentorBoardCreatePage({
  mentorToken,
  onBack = noop,
  onSubmit = noop,
}: Props): React.JSX.Element {
  const handleSubmit = async (body: string) => {
    const content = body.trim();

    if (!mentorToken) {
      throw new Error('멘토 토큰이 없습니다.');
    }

    const { board } = await fetchMentorBoard();
    await createBoardPost({
      boardId: board._id,
      content,
      token: mentorToken,
    });

    onSubmit();
  };

  return <PostComposeScreen onBack={onBack} onSubmit={handleSubmit} />;
}

export default MentorBoardCreatePage;
