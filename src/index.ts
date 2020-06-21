import { connect, disconnect } from 'mongoose';
import { MongoDBEntityProvider } from './MongoDBEntityProvider';
import {
  EntityType,
  Question,
  ValueType,
  AnswerValueSingle,
} from '@decision-trees/core';

connect(
  'mongodb://root:example@0.0.0.0:27017/decision-tree?authSource=admin&authMechanism=SCRAM-SHA-256&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
  {
    useNewUrlParser: true,
  }
).then(
  async () => {
    const provider = new MongoDBEntityProvider();
    const id = '5eed0d4b748bfa4596df5b1c';
    const entity = await provider.update(id, {
      id,
      type: EntityType.Question,
      text: [
        {
          locale: 'de',
          value: 'Haben Sie den Netzstecker in die Steckdose gesteckt.',
        },
      ],
      answers: [
        {
          text: [{ locale: 'de', value: 'Ja' }],
          value: new AnswerValueSingle(ValueType.text, 'ja'),
          targetId: '',
        },
      ],
    } as Question);
    console.log(entity);
    await disconnect();
    return;
  },
  (err) => {
    console.log('err', err);
  }
);
