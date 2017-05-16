import * as React from 'react';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { DetailsList } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Selection } from 'office-ui-fabric-react/lib/Selection';
const SUBREDDIT = 'bostonterriers';
const THUMBSIZE = 80;
let columns = [
  {
    key: 'score',
    name: 'Score',
    fieldName: 'score',
    minWidth: 40,
    maxWidth: 40,
    isResizable: true
  },
  {
    key: 'thumb',
    fieldName: 'thumb',
    name: 'thub',
    minWidth: THUMBSIZE,
    maxWidth: THUMBSIZE,
    onRender: (item) => (
      <Image
        className='thumb'
        imageFit={ ImageFit.cover }
        src={ item.thumb }
        width={ THUMBSIZE }
        height={ THUMBSIZE }
      />)
  },
  {
    key: 'article',
    name: 'Post',
    fieldName: 'thumb',
    minWidth: 100,
    maxWidth: 180,
    isResizable: true,
    onRender: (item) => (
      <div style={ { whiteSpace: 'normal' } }>
        <Link className='ms-font-xl' href={ item.url } target='_blank'>{ item.title }</Link>
        <div className='itemMetadata'>
          <span>By { item.author }</span>
          <span><i className='ms-Icon ms-Icon--Chat' /> { item.comments } comment{ item.comments === 1 ? '' : 's' }</span>
        </div>
      </div>
    )
  },
  {
    key: 'author',
    name: 'Author',
    fieldName: 'thumb',
    minWidth: 40,
    maxWidth: 40,
    isResizable: true,
    onRender: (item) => (
      <div> { item.author } </div>
    )
  },
  {
    key: 'id',
    name: 'Id',
    fieldName: 'thumb',
    minWidth: 40,
    maxWidth: 40,
    isResizable: true,
    onRender: (item) => (
      <div style={
        {
          backgroundColor: 'blue',
          color: 'silver',
          height: '100px'
        }
      }> { item.key } </div>
    )
  },
  {
    key: 'subreddit',
    name: 'Subreddit',
    fieldName: 'thumb',
    minWidth: 40,
    maxWidth: 40,
    isResizable: true,
    onRender: (item) => (
      <div style={ { backgroundColor: 'red' } }> { item.subreddit } </div>
    )
  },
  {
    key: 'url',
    name: 'Url',
    fieldName: 'thumb',
    minWidth: 40,
    maxWidth: 40,
    isResizable: true,
    onRender: (item) => (
      <div style={ { backgroundColor: 'pink' } }>
        <Link> { item.url } </Link>
      </div>
    )
  }
];

export class DetailsListPage extends React.Component<{}, {
  rows,
  subreddit,
  isLoading,
  nextPageToken
}> {
  private _selection;
  private _groups = [
    {
      key: 'tow',
      name: 'tow',
      startIndex: 0,
      count: 1,
      level: 0,
      isCollapsed: true,
      children: [{
        key: 'a',
        name: 'a',
        startIndex: 0,
        count: 1,
        level: 1,
        isCollapsed: true
      }]
    },
    {
      key: 'twee',
      name: 'twee',
      startIndex: 0,
      count: 1,
      level: 0,
      isCollapsed: true,
      children: [{
        key: 'b',
        name: 'b',
        startIndex: 0,
        count: 1,
        level: 1,
        isCollapsed: true
      }]
    },
    {
      key: 'one',
      name: 'one',
      startIndex: 1,
      count: 200,
      level: 0,
      isCollapsed: true,
      children: [{
        key: 'onesub',
        name: 'onesub',
        startIndex: 1,
        count: 50,
        level: 1,
        isCollapsed: true
      },
      {
        key: 'twosub',
        name: 'twosub',
        startIndex: 52,
        count: 60,
        level: 1,
        isCollapsed: true
      }]
    }
  ];
  private _list;
  constructor() {
    super();

    this._selection = new Selection();
    this.state = {
      rows: [],
      isLoading: false,
      subreddit: SUBREDDIT,
      nextPageToken: null
    };
    this._onReloadClick = this._onReloadClick.bind(this);
  }

  public componentDidMount() {
    // this._onReloadClick();
  }
  public hasGottenStuff: boolean = false;

  public render() {
    let { rows, subreddit, isLoading } = this.state;

    return (
      <div>
        <div className='ms-font-xxl titleArea'>
          <span className='title'>reddit/r/<Link className='reddit'>{ subreddit }</Link></span>
          { !isLoading ? (
            <IconButton icon='Refresh' className='refresh' onClick={ this._onReloadClick } />
          ) : (
              <Spinner className='inlineSpinner' />
            ) }
        </div>
        { rows && (
          <MarqueeSelection selection={ this._selection }>
            <DetailsList
              ref={ (list) => this._list = list }
              items={ rows }
              columns={ columns }
              selection={ this._selection }
              groups={ this._groups }
              groupProps={ {
                isAllGroupsCollapsed: true,
                onRenderFooter: () => <div> { "I'm a footer!" } </div>,
                headerProps: {
                  onToggleCollapse: (group) => this._onCollapse(group)
                }
              }
              }
            />
            { isLoading && (
              <Spinner className='loadingSpinner' label='Loading...' />
            ) }
          </MarqueeSelection>
        ) }
      </div>
    );
  }

  private _onCollapse(group) {
    // this._groups = this._iterate(group, this._groups);
    if (group.level > 0 && !this.hasGottenStuff) {
      this.hasGottenStuff = true;
      this._onLoadNextPage();
    }
    // this.forceUpdate();
  }

  private _onReloadClick() {
    this.setState({ rows: null, nextPageToken: null });

    this._onLoadNextPage();
  }

  private _onDelayedLoadNextPage() {
    let { isLoading } = this.state;

    if (!isLoading) {
      this.setState({ isLoading: true });

      // This setTimeout is only here for illustrating a slow API. Reddit API is pretty fast.
      this._onLoadNextPage();
    }
  }

  private _onLoadNextPage() {
    let { subreddit } = this.state;
    let url = `https://www.reddit.com/r/` +
      `${subreddit}.json` +
      '?limit=100';

    this.setState({ isLoading: true });

    fetch(url).then(
      response => response.json()).then(json => {
        let rows = this._getRowsFromData((json as any).data);
        let url2 = `https://www.reddit.com/r/` +
          `${subreddit}.json` +
          '?limit=100' +
          '&after=2';
        fetch(url2).then(
          response2 => response2.json()).then(json2 => {
            let otherRows = this._getRowsFromData((json2 as any).data)
            rows = rows.concat(otherRows);
            this.setState({
              rows,
              isLoading: false
            }, () => this._forceUpdate(1000, 5));
            this._selection.setItems(rows);
          });
      });
  }
  private _forceUpdate(timeout, times) {
    this._list.forceUpdate();
    // setTimeout(() => this._list.forceUpdate(), 4000);
    // if (times > 0) {
    //   let time = timeout || 0;
    //   if (this._list) {
    //     setTimeout(() => this._forceUpdate(timeout, times - 1)
    //       , time);
    //   }
    // }
  }

  private _getRowsFromData(response) {
    let { rows, nextPageToken } = this.state;

    let items = response.children.map(child => {
      let data = child.data;
      return {
        key: data.id,
        subreddit: data.subreddit,
        title: data.title,
        author: data.author,
        url: data.url,
        score: data.score,
        thumb: data.thumbnail,
        comments: data.num_comments
      };
    });

    if (rows && nextPageToken) {
      items = rows.slice(0, rows.length - 1).concat(items);
    }

    if (response.after) {
      items.push(null);
      console.log(items)
    }

    return items;
  }
}
