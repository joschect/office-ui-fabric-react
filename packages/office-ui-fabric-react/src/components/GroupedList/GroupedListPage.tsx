import * as React from 'react';
import {
  ExampleCard,
  IComponentDemoPageProps,
  ComponentPage,
  PropertiesTableSet
} from '@uifabric/example-app-base';
import { GroupedListBasicExample } from './examples/GroupedList.Basic.Example';
import { GroupedListCustomExample } from './examples/GroupedList.Custom.Example';

const GroupedListBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/GroupedList/examples/GroupedList.Basic.Example.tsx') as string;
const GroupedListCustomExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/GroupedList/examples/GroupedList.Custom.Example.tsx') as string;

export class GroupedListPage extends React.Component<IComponentDemoPageProps, {}> {
  public render() {
    return (
      <div>
        <GroupedListBasicExample />
      </div>
    );
  }

}
