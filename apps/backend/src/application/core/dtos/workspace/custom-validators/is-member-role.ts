import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator } from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: false })
export class IsMemberRoleValidator implements ValidatorConstraintInterface {
  validate(value: unknown) {
    const roles = new Set(['owner', 'admin', 'moderator', 'editor', 'member']);
    return typeof value === 'string' && roles.has(value);
  }
}

export const IsMemberRole = (validationOptions: ValidationOptions) => {
  return (obj: object, property: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: IsMemberRoleValidator
    });
  };
};
