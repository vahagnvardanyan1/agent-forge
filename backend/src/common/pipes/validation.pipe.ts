import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;
    const object = plainToInstance(
      metatype as new (...args: unknown[]) => object,
      value,
    );
    const errors = await validate(object);
    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints ?? {}).join(', '))
        .join('; ');
      throw new BadRequestException(messages);
    }
    return value;
  }

  private toValidate(
    metatype: abstract new (...args: unknown[]) => unknown,
  ): boolean {
    const types: Array<abstract new (...args: unknown[]) => unknown> = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
