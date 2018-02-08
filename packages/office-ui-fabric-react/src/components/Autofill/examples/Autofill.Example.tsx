import * as React from 'react';
import {
  Autofill
} from '../index';
import {
  autobind
} from '../../../Utilities';
import {
  AutofillSuggestions
} from './AutofillExampleData';
export interface IAutofillExampleState {
  suggestedValue?: string;
}

export class AutofillExample extends React.Component<{}, IAutofillExampleState> {
  public constructor(props: {}) {
    super(props);
    this.state = { suggestedValue: '' };
  }

  public render() {
    return (
      <Autofill
        suggestedDisplayValue={ this.state.suggestedValue }
        onInputValueChange={ this._onChange }
      />
    );
  }

  @autobind
  private _onChange(currentText: string) {
    const filteredSuggestions = AutofillSuggestions.filter((value: string) => {
      return value.toLowerCase().indexOf(currentText.toLowerCase()) === 0;
    });
    const suggestedValue = filteredSuggestions && filteredSuggestions.length > 0 ? filteredSuggestions[0] : '';
    this.setState({
      suggestedValue: suggestedValue
    });
  }
}
