import * as React from 'react';
import {
  GroupedList,
  IGroup
} from 'office-ui-fabric-react/lib/components/GroupedList/index';
import { IColumn, DetailsList } from 'office-ui-fabric-react/lib/DetailsList';
import { DetailsRow } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsRow';
import {
  FocusZone
} from 'office-ui-fabric-react/lib/FocusZone';
import {
  Selection,
  SelectionMode,
  SelectionZone
} from 'office-ui-fabric-react/lib/utilities/selection/index';

import {
  createListItems,
  createGroups
} from '@uifabric/example-app-base';

const groupCount = 3;
const groupDepth = 2;

let _items: any[];
let _groups: IGroup[];

export class GroupedListBasicExample extends React.Component<any, any> {
  private _selection: Selection;

  constructor() {
    super();

    _items = _items || createListItems(200000);
    _groups = _groups || this.createGroups(groupCount, groupDepth, 0, 150);

    this._onRenderCell = this._onRenderCell.bind(this);
    this._selection = new Selection;
    this._selection.setItems(_items);
  }

  public render() {
    return (
      <FocusZone>
        <SelectionZone
          selection={ this._selection }
          selectionMode={ SelectionMode.multiple }
        >
          <DetailsList
            items={ _items }
            selection={ this._selection }
            selectionMode={ SelectionMode.multiple }
            groups={ _groups }
            groupProps={ {
              isAllGroupsCollapsed: true,
              getGroupItemLimit: () => 100
            }
            }

          />
        </SelectionZone>
      </FocusZone>
    );
  }

  private _onRenderCell(nestingDepth: number, item: any, itemIndex: number) {
    let {
      _selection: selection
    } = this;
    return (
      <DetailsRow
        columns={
          Object.keys(item).slice(0, 3).map((value): IColumn => {
            return {
              key: value,
              name: value,
              fieldName: value,
              minWidth: 300
            };
          })
        }
        groupNestingDepth={ nestingDepth }
        item={ item }
        itemIndex={ itemIndex }
        selection={ selection }
        selectionMode={ SelectionMode.multiple }
      />
    );
  }

  public createGroups(
    groupCount: number, groupDepth: number, startIndex: number,
    itemsPerGroup: number, level?: number, key?: string): IGroup[] {
    key = key ? key + '-' : '';
    level = level ? level : 0;
    let count = Math.pow(itemsPerGroup, groupDepth);
    return Array.apply(null, Array(groupCount)).map((value, index) => {
      return {
        count: count,
        key: 'group' + key + index,
        name: 'group ' + key + index,
        startIndex: index * count + startIndex,
        level: level,
        isCollapsed: true,
        children: groupDepth > 1 ?
          this.createGroups(groupCount, groupDepth - 1, index * count + startIndex, itemsPerGroup, level + 1, key + index) :
          []
      };
    });
  }

}
