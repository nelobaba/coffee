import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform { // can be used to add default values
  transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed. "${val}" is not an integer.`,
      );
    }
    return val;
  }
}
