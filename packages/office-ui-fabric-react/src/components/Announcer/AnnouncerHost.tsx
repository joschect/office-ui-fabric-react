
import * as React from 'react';

export interface IAnnouncerHostState {
  queuedAnnouncements: string[];
  announcing?: boolean;
  currentAnnouncement?: string;
}

export interface IAnnouncerHostProps {
  nextMessage?: string;
  getHost?: (host: AnnouncerHost) => void;
}

export class AnnouncerHost extends React.Component<IAnnouncerHostProps, IAnnouncerHostState> {

  public constructor(props: IAnnouncerHostProps) {
    super(props);
    this.state = { queuedAnnouncements: [] };
  }

  public componentWillReceiveProps(props: IAnnouncerHostProps) {
    if (props.nextMessage && props.nextMessage !== this.props.nextMessage) {
      this.setState({
        queuedAnnouncements: this.state.queuedAnnouncements.concat([props.nextMessage]),
        announcing: true
      });
    }
  }

  public componentDidUpdate() {
    if (this.state.queuedAnnouncements.length > 0) {
      const nextAnnouncement = this.state.queuedAnnouncements[0];
      this._setStateWithTimeout({
        queuedAnnouncements: this.state.queuedAnnouncements.slice(1),
        currentAnnouncement: nextAnnouncement
      });
    } else if (this.state.announcing) {
      this._setStateWithTimeout({
        announcing: false,
        queuedAnnouncements: []
      });
    } else if (this.state.currentAnnouncement) {
      this.setState({ currentAnnouncement: undefined });
    }
  }

  public componentDidMount() {
    if (this.props.getHost) {
      this.props.getHost(this);
    }
  }

  public render() {
    let ariaLive = this.state.announcing ? {
      'aria-live': 'assertive',
      'role': 'alert',
    } : null;
    return <div { ...ariaLive } >
      { this.state.currentAnnouncement && <div> { this.state.currentAnnouncement }</div> }
    </div >;
  }

  public queueAnnouncement(announcement: string) {
    this.setState({
      queuedAnnouncements: this.state.queuedAnnouncements.concat([announcement]),
      announcing: true
    });
  }

  private _setStateWithTimeout(state: IAnnouncerHostState) {
    setTimeout(() => {
      this.setState(state);
    },
      500);
  }

  public clearAnnouncements() {
    this.setState({
      queuedAnnouncements: []
    });
  }
}