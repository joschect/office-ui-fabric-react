import * as React from 'react';
import { IAutofillProps, IAutofill } from './Autofill.types';
import {
  BaseComponent,
  KeyCodes,
  autobind,
  getNativeProps,
  inputProperties,
  css
} from '../../Utilities';
import * as stylesImport from './GhostAutofill.scss';
import * as baseAutoFillStyles from './Autofill.BaseStyle.scss';
const styles: any = stylesImport;

export interface IBaseAutoFillState {
  displayValue?: string;
}

export interface IInputPositon {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

const SELECTION_FORWARD = 'forward';
const SELECTION_BACKWARD = 'backward';

export class GhostAutoFill extends BaseComponent<IAutofillProps, any> implements IAutofill {
  private _inputElement: HTMLInputElement;
  private _autofillInputElement: HTMLInputElement;

  constructor(props: IAutofillProps) {
    super(props);
    this.state = {
      value: '',
      inputPositon: {}
    };
  }

  public focus() {
    this._inputElement.focus();
  }

  public clear() {
    this.setState({
      value: ''
    });
  }

  public get cursorLocation(): number {
    if (this._inputElement) {
      let inputElement = this._inputElement;
      if (inputElement.selectionDirection !== SELECTION_FORWARD) {
        return inputElement.selectionEnd;
      } else {
        return inputElement.selectionStart;
      }
    } else {
      return -1;
    }
  }

  public get isValueSelected(): boolean {
    return this.inputElement.selectionStart !== this.inputElement.selectionEnd;
  }

  public get value(): string {
    return this.state.value;
  }

  public get selectionStart(): number {
    return this._inputElement ? this._inputElement.selectionStart : -1;
  }

  public get selectionEnd(): number {
    return this._inputElement ? this._inputElement.selectionEnd : -1;
  }

  public get inputElement(): HTMLInputElement {
    return this._inputElement;
  }
  public componentDidMount() {
    this._setInputPosition(this._autofillInputElement);
  }

  public componentDidUpdate() {
    this._setInputPosition(this._autofillInputElement);
  }

  public render() {
    const {
      suggestedDisplayValue
    } = this.props;
    let { value } = this.state;
    const nativeProps = getNativeProps(this.props, inputProperties);
    let displayValue = value + (suggestedDisplayValue ? suggestedDisplayValue!.substring(value.length) : '');
    return (
      <div
        className={ css(styles.ghostAutoFillContainer, baseAutoFillStyles.Autofill, this.props.className) }
      >
        <input
          ref={ this._resolveRef('_autofillInputElement') }
          value={ displayValue }
          className={ css(styles.ghostAutoFillBottom) }
        />
        <input
          { ...nativeProps }
          ref={ this._resolveRef('_inputElement') }
          className={ css(styles.ghostAutoFillTop) }
          value={ value }
          onChange={ this._onChange }
          style={ {
            width: this.state.inputPositon.width + 'px',
            offsetLeft: this.state.inputPositon.left,
            top: this.state.inputPositon.top,
            height: this.state.inputPositon.height + 'px'
          } }
        />
      </div>
    );
  }

  @autobind
  private _onChange(ev: React.FormEvent<HTMLInputElement>) {
    let value = this._inputElement.value;
    this.setState({ value: value },
      () => this._notifyInputChange(value));
  }

  private _notifyInputChange(newValue: string) {
    if (this.props.onInputValueChange) {
      this.props.onInputValueChange(newValue);
    }
  }

  private _setInputPosition(element: HTMLInputElement) {
    if (element) {
      let inputPositon: IInputPositon = {};
      let boundRect = element.getBoundingClientRect();
      inputPositon.width = boundRect.width;
      inputPositon.height = boundRect.height;
      inputPositon.left = element.offsetLeft;
      inputPositon.top = element.offsetTop;
      if (inputPositon.width !== this.state.inputPositon.width ||
        inputPositon.top !== this.state.inputPositon.top ||
        inputPositon.left !== this.state.inputPositon.left ||
        inputPositon.height !== this.state.inputPositon.height) {
        this.setState({ inputPositon });
      }
    }
  }
}