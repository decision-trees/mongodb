import { Schema, model } from 'mongoose';
import { EntityType, ValueType } from '@decision-trees/core';

const EntitySchema = new Schema(
  {
    type: {
      type: String,
      enum: [EntityType.Question, EntityType.Solution],
      required: true,
    },
    properties: [{ name: String, locale: String, value: String }],
    text: [{ locale: String, value: String }],
    answers: [
      {
        text: [{ locale: String, value: String }],
        value: {
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
        targetId: String,
      },
    ],
  },
  {
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export default model('Entity', EntitySchema, 'entities');
