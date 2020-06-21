import {
  Session,
  SessionProvider,
  SessionStatus,
  SessionHistoryEntry,
  KeyValuePair,
  DecisionTreeError,
  ErrorCode,
} from '@decision-trees/core';
import SessionImpl from './model/Session';
import SessionHistoryEntryImpl from './model/SessionHistoryEntry';

export class MongoDBSessionProvider implements SessionProvider {
  getSession(id: string): Promise<Session> {
    return SessionImpl.findById(id).then((doc) => doc?.toObject());
  }
  open(
    user: string,
    target: string,
    scope?: KeyValuePair[] | undefined,
    parentId?: string | undefined
  ): Promise<Session> {
    const session = new SessionImpl({
      creator: user,
      target,
      status: SessionStatus.Opened,
      scope,
    });
    return session.save().then((doc) => doc.toObject());
  }
  changeStatus(
    id: string,
    status: SessionStatus,
    user: string
  ): Promise<Session> {
    return SessionImpl.findById(id).then((session) => {
      if (!session) {
        throw new DecisionTreeError(
          ErrorCode.NotFound,
          'Session is not found for the given Id'
        );
      }
      return session
        .set('status', status)
        .save()
        .then((doc) => doc.toObject());
    });
  }
  mergeScope(
    id: string,
    scope: KeyValuePair[],
    user: string
  ): Promise<Session> {
    if (!scope) {
      return this.getSession(id);
    }
    return SessionImpl.findById(id).then((session) => {
      if (!session) {
        throw new DecisionTreeError(
          ErrorCode.NotFound,
          'Session is not found for the given Id'
        );
      }
      const newKeys = scope.map((entry) => entry.key);
      const currentScope = session
        .get('scope')
        .filter((entry: KeyValuePair) => !newKeys.includes(entry.key));
      session.set('scope', [...currentScope, ...scope]);
      return session.save().then((doc) => doc.toObject());
    });
  }
  currentHistoryEntry(id: string): Promise<SessionHistoryEntry> {
    return SessionHistoryEntryImpl.find({ sessionId: id })
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(1)
      .then((data) => (data.length > 0 ? data[0] : null))
      .then((doc) => doc?.toObject());
  }
  getHistory(id: string): Promise<SessionHistoryEntry[]> {
    return SessionHistoryEntryImpl.find({ sessionId: id }).then((data) =>
      data.map((doc) => doc.toObject())
    );
  }
  addEntry(id: string, entry: SessionHistoryEntry): Promise<void> {
    const newEntry = new SessionHistoryEntryImpl({ ...entry, sessionId: id });
    return newEntry.save().then((doc) => void 0);
  }
}
