interface StudySession {
  topic: string;
  duration: number;
  date: string;
}

export function validateStudySession(session: StudySession): boolean {
  return (
    typeof session.topic === 'string' &&
    session.duration > 0 &&
    !isNaN(Date.parse(session.date))
  );
}
