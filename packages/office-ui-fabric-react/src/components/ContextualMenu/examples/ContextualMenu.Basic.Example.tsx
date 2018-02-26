import * as React from 'react';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { getAnnouncer, Announcer } from 'office-ui-fabric-react/lib/components/Announcer/Announcer';
import './ContextualMenuExample.scss';

export class ContextualMenuBasicExample extends React.Component {

  private _announcer: Announcer;
  constructor(props: {}) {
    super(props);
    this._announcer = getAnnouncer();
    this.state = {
      showCallout: false
    };
  }

  public render() {
    return (
      <div>
        <DefaultButton
          id='ContextualMenuButton1'
          text='Click for ContextualMenu'
          menuProps={ {
            shouldFocusOnMount: true,
            items: [
              {
                key: 'newItem',
                name: 'New',
                onClick: () => {
                  this._announcer.queueAnnouncement('wooh');
                  this._announcer.queueAnnouncement('squeeeeeeeeeeeepps squee squeepy squeep square');
                }
              },
              {
                key: 'divider_1',
                itemType: ContextualMenuItemType.Divider
              },
              {
                key: 'rename',
                name: 'Rename',
                onClick: () => {
                  this._announcer.queueAnnouncement('Hi there this is a much longer announcement that could take a great deal of time.');
                }
              },
              {
                key: 'edit',
                name: 'Edit'
              },
              {
                key: 'properties',
                name: 'Properties'
              },
              {
                key: 'disabled',
                name: 'Disabled item',
                disabled: true
              }
            ]
          } }
        />
      </div>
    );
  }
}
