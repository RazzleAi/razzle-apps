import { Action, ActionParam, RazzleResponse } from '@razzledotai/sdk';
import { RazzleText } from '@razzledotai/widgets';

export class Summerizer {
  @Action({
    name: 'summerize',
    description: 'Summerize any type of text to a few lines',
  })
  summerize(@ActionParam('textToSummerize') text: string) {
    return new RazzleResponse({
      ui: new RazzleText({ text }),
    });
  }
}
