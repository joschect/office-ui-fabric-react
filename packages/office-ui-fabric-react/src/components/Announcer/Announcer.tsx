import * as React from 'react';
import { AnnouncerHost } from './AnnouncerHost';
import * as ReactDOM from 'react-dom';

let _announcer: Announcer;

export function getAnnouncer(): Announcer {
  if (!_announcer) {
    _announcer = new Announcer();
  }
  return _announcer;
}

export class Announcer {

  private _announcerHost: AnnouncerHost;
  private _root: HTMLDivElement;
  public constructor() {
    this._createAnnouncerHost();
  }

  public queueAnnouncement(announcement: string) {
    if (this._announcerHost) {
      this._announcerHost.queueAnnouncement(announcement);
    }
  }

  public clearAll() {
    this._announcerHost.clearAnnouncements();
  }

  private _createAnnouncerHost() {
    if (!this._root) {
      let elem = document.createElement('div');
      document.body.appendChild(elem);
      this._root = elem;
    }
    if (!this._announcerHost) {
      this._announcerHost = ReactDOM.render(
        <AnnouncerHost
          ref={ this._setRef.bind(this) }
        />,
        this._root) as AnnouncerHost;
    }
  }

  private _setRef(blah: AnnouncerHost) {
    if (blah) {
      this._announcerHost = blah;
    }
  }
}