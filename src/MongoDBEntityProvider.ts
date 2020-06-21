import {
  Entity,
  EntityListResult,
  EntityProvider,
  EntityType,
  DecisionTreeError,
  ErrorCode,
} from '@decision-trees/core';
import EntityImpl from './model/Entity';

export class MongoDBEntityProvider implements EntityProvider {
  create(type: EntityType): Promise<Entity> {
    const entity = new EntityImpl();
    entity.set('type', type);
    return entity.save().then((doc) => doc.toObject());
  }
  read(id: string): Promise<Entity | undefined> {
    return EntityImpl.findById(id).then((doc) => doc?.toObject());
  }
  update(id: string, entity: Entity): Promise<Entity> {
    console.log('Entity:', entity);
    return EntityImpl.findById(id)
      .then((doc) => {
        if (!doc) {
          throw new DecisionTreeError(
            ErrorCode.NotFound,
            'Failed to update the entity by the given Id.'
          );
        }
        console.log(doc.toObject());
        doc.set(entity);
        console.log(doc.toObject());
        return doc.save();
      })
      .then((doc) => doc.toObject());
  }
  delete(id: string): Promise<void> {
    return EntityImpl.deleteOne({ _id: id }).then((result) => {
      if (!result.ok) {
        throw new DecisionTreeError(
          ErrorCode.Unexpected,
          'Failed to delete the entity by the given Id.'
        );
      }
    });
  }
  list(skip: number = 0, limit: number = 20): Promise<EntityListResult> {
    return EntityImpl.find()
      .count()
      .then((count) =>
        EntityImpl.find()
          .skip(skip)
          .limit(limit)
          .then((result) => {
            return {
              count,
              entities: result.map((doc) => doc.toObject()),
              skip,
              limit,
            };
          })
      );
  }
}
