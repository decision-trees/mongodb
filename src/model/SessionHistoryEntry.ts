import { Schema, model } from 'mongoose';
import { EntityType, ValueType, Action } from '@decision-trees/core';

const SessionHistoryEntrySchema = new Schema(
  {
    sessionId: { type: String, index: true, required: true },
    action: {
      type: String,
      enum: [
        Action.Open,
        Action.Next,
        Action.Suspend,
        Action.Resume,
        Action.Close,
      ],
      required: true,
      entityId: String,
      answer: {
        type: {
          type: String,
          enum: [
            ValueType.date,
            ValueType.float,
            ValueType.integer,
            ValueType.text,
            ValueType.timestamp,
          ],
        },
        range: Boolean,
        value: Schema.Types.Mixed,
        min: Schema.Types.Mixed,
        max: Schema.Types.Mixed,
      },
      scope: [{ key: String, value: String }],
      nextId: String,
      nextType: {
        type: String,
        enum: [EntityType.Question, EntityType.Solution],
        required: true,
      },
      user: String,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        ret.created = ret.createdAt;
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

export default model(
  'SessionHistoryEntry',
  SessionHistoryEntrySchema,
  'sessionhistory'
);
