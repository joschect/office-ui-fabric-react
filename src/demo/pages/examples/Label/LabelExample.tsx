import * as React from 'react';
import Label from '../../../../components/Label';
import Link from '../../../../components/Link';
import ExampleCard from '../../../components/ExampleCard';
import PropertiesTable from '../../../components/PropertiesTable';

export default class LabelExample extends React.Component<any, any> {
  public render() {
    return (
      <div className='LabelExample'>
        <h1 className='ms-font-xxl'>Label</h1>
        <div><Link text='Labels' url='http://dev.office.com/fabric/components/label' /> render a text string.</div>

        <PropertiesTable properties={ [] } />

        <h2 className='ms-font-xl'>Examples</h2>

        <ExampleCard title='Label'>
          <Label>I'm a Label</Label>
        </ExampleCard>

      </div>
    );
  }

}
