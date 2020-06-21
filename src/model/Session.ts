import { Schema, model } from 'mongoose';
import { EntityType, ValueType } from '@decision-trees/core';

const SessionSchema = new Schema(
  {
    parentId: { type: String, index: true },
    target: { type: String, index: true },
    status: { type: Number, index: true },
    scope: [{ key: String, value: Schema.Types.Mixed }],
    creator: String,
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

export default model('Session', SessionSchema, 'sessions');
