import * as React from 'react';
import {
  BaseComponent,
  autobind,
  assign,
  css
} from '../../Utilities';
import {
  IGroupedList,
  IGroupedListProps,
  IGroup,
  IGroupDividerProps
} from './GroupedList.Props';
import {
  List
} from '../../List';
import {
  SelectionMode,
  SELECTION_CHANGE
} from '../../utilities/selection/index';
import { GroupFooter } from './GroupFooter';
import { GroupHeader } from './GroupHeader';
import * as stylesImport from './GroupedList.scss';
const styles: any = stylesImport;

export enum ItemType {
  normal,
  header,
  footer
}

export type GroupedListItem = {
  itemType: ItemType;
  nestingDepth?: number,
  item?: any,
  index?: number
  isSelected?: boolean;
};

export interface IGroupedListState {
  lastWidth?: number;
  lastSelectionMode?: SelectionMode;
  groups?: IGroup[];

  items?: GroupedListItem[];
}

export class GroupedList extends BaseComponent<IGroupedListProps, IGroupedListState> implements IGroupedList {
  public static defaultProps = {
    selectionMode: SelectionMode.multiple,
    isHeaderVisible: true,
    groupProps: {}
  };

  public refs: {
    [key: string]: React.ReactInstance,
    root: HTMLElement,
    list: List
  };

  private _isSomeGroupExpanded: boolean;

  constructor(props: IGroupedListProps) {
    super(props);

    this._isSomeGroupExpanded = this._computeIsSomeGroupExpanded(props.groups);

    this.state = {
      lastWidth: 0,
      groups: props.groups
    };
  }

  public componentWillReceiveProps(newProps) {
    let {
      groups,
      selectionMode
    } = this.props;
    let shouldForceUpdates = false;

    if (newProps.groups !== groups) {
      this.setState({ groups: newProps.groups });
      shouldForceUpdates = true;
    }

    if (newProps.selectionMode !== selectionMode) {
      shouldForceUpdates = true;
    }

    if (shouldForceUpdates) {
      this._forceListUpdates();
    }
  }

  public componentDidMount() {
    let { dragDropHelper, selection } = this.props;

    if (selection) {
      this._events.on(selection, SELECTION_CHANGE, this._onSelectionChange);
    }
  }

  public render() {
    let {
      className,
      items,
      groupProps
    } = this.props;
    let {
      groups
    } = this.state;
    let groupedItems: GroupedListItem[] = this._buildGroups(groups);
    return (
      <div
        ref='root'
        className={ css('ms-GroupedList', styles.root, className) }
        data-automationid='GroupedList'
        data-is-scrollable='false'
        role='grid'
      >
        <List
          ref='list'
          items={ groupedItems }
          onRenderCell={ this._onRenderItem }
        />
      </div>
    );
  }

  public forceUpdate() {
    super.forceUpdate();
    this._forceListUpdates();
  }

  public toggleCollapseAll(allCollapsed: boolean) {
    let { groups } = this.state;
    let { groupProps } = this.props;
    let onToggleCollapseAll = groupProps && groupProps.onToggleCollapseAll;

    if (groups) {
      if (onToggleCollapseAll) {
        onToggleCollapseAll(allCollapsed);
      }

      for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        groups[groupIndex].isCollapsed = allCollapsed;
      }

      this._updateIsSomeGroupExpanded();

      this.forceUpdate();
    }
  }

  private _onSelectionChange() {
    this.forceUpdate();
  }

  private _buildGroups(groups: IGroup[]) {
    const { items, groupProps, selection } = this.props;
    let groupedItems: GroupedListItem[] = [];
    let currIndex = 0;
    let appendGroupedChildren = (groupList: IGroup[]) => {
      for (const group of groupList) {
        let renderCount = group && groupProps.getGroupItemLimit ? groupProps.getGroupItemLimit(group) : Infinity;
        let groupCount = Math.min(group.count, renderCount);
        groupedItems.push({
          item: group,
          itemType: ItemType.header,
          index: currIndex,
          isSelected: (selection && group) ? selection.isRangeSelected(group.startIndex, groupCount) : false,
          nestingDepth: group.level
        });
        currIndex++;
        if (!group.isCollapsed) {
          if (!group.children || group.children.length < 1) {
            for (let i = group.startIndex; i < items.length && i < (group.startIndex + groupCount); i++) {
              groupedItems.push({
                item: items[i],
                itemType: ItemType.normal,
                index: i,
                isSelected: selection ? selection.isIndexSelected(i) : false,
                nestingDepth: group.level
              });
              currIndex++;
            }
            let isFooterVisible = group && !group.children && !group.isCollapsed && !group.isShowingAll &&
              (group.count > renderCount || group.hasMoreData);
            if (isFooterVisible) {
              groupedItems.push({
                item: group,
                itemType: ItemType.footer,
                index: currIndex,
                nestingDepth: group.level
              });
              currIndex++;
            }
          } else {
            appendGroupedChildren(group.children);
          }
        }
      }
    };

    appendGroupedChildren(groups);
    return groupedItems;
  }

  @autobind
  private _onRenderItem(item: GroupedListItem) {
    const { groupProps, viewport, selectionMode } = this.props;
    const { onRenderHeader = this._renderHeader,
      onRenderFooter = this._renderFooter } = groupProps;
    let dividerProps: IGroupDividerProps = {
      group: item.item,
      groupIndex: item.index,
      groupLevel: item ? item.nestingDepth : 0,
      isSelected: item.isSelected,
      viewport: viewport,
      selectionMode: selectionMode,
      onToggleSelectGroup: this._onToggleSelectGroup,
      onToggleCollapse: this._onToggleCollapse,
      onToggleSummarize: this._onToggleSummarize
    };
    let groupHeaderProps: IGroupDividerProps = assign({}, groupProps.headerProps, dividerProps);
    let groupFooterProps: IGroupDividerProps = assign({}, groupProps.footerProps, dividerProps);
    let rendered;
    switch (item.itemType) {
      case ItemType.header:
        rendered = onRenderHeader(groupHeaderProps, this._renderHeader);
        break;
      case ItemType.footer:
        rendered = onRenderFooter(groupFooterProps, this._renderFooter);
        break;
      default:
        rendered = this._renderItem(item);
        break;
    }
    return rendered;
  }

  private _renderItem(item: GroupedListItem) {
    return this.props.onRenderCell(item.nestingDepth, item.item, item.index);

  }
  private _renderHeader(groupHeaderProps: IGroupDividerProps) {
    return <GroupHeader {...groupHeaderProps} />;
  }
  private _renderFooter(groupHeaderProps: IGroupDividerProps) {
    return <GroupFooter {...groupHeaderProps} />;
  }

  @autobind
  private _onToggleCollapse(group: IGroup) {
    let { groupProps } = this.props;
    let onToggleCollapse = groupProps && groupProps.headerProps && groupProps.headerProps.onToggleCollapse;

    if (group) {
      if (onToggleCollapse) {
        onToggleCollapse(group);
      }

      group.isCollapsed = !group.isCollapsed;
      this._updateIsSomeGroupExpanded();
      this.forceUpdate();
    }
  }

  @autobind
  private _onToggleSelectGroup(group: IGroup) {
    if (group) {
      this.props.selection.toggleRangeSelected(group.startIndex, group.count);
    }
  }

  private _forceListUpdates(groups?: IGroup[]) {
    if (this.refs.list) {
      this.refs.list.forceUpdate();
    }
  }

  @autobind
  private _onToggleSummarize(group: IGroup) {
    let { groupProps } = this.props;
    let onToggleSummarize = groupProps && groupProps.footerProps && groupProps.footerProps.onToggleSummarize;

    if (onToggleSummarize) {
      onToggleSummarize(group);
    } else {
      if (group) {
        group.isShowingAll = !group.isShowingAll;
      }

      this.forceUpdate();
    }
  }

  private _computeIsSomeGroupExpanded(groups: IGroup[]) {
    return groups && groups.some(group => group.children ? this._computeIsSomeGroupExpanded(group.children) : !group.isCollapsed);
  }

  private _updateIsSomeGroupExpanded() {
    let { groups } = this.state;
    let { onGroupExpandStateChanged } = this.props;

    let newIsSomeGroupExpanded = this._computeIsSomeGroupExpanded(groups);
    if (this._isSomeGroupExpanded !== newIsSomeGroupExpanded) {
      if (onGroupExpandStateChanged) {
        onGroupExpandStateChanged(newIsSomeGroupExpanded);
      }
      this._isSomeGroupExpanded = newIsSomeGroupExpanded;
    }
  }
}
