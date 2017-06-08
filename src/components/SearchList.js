import React, { Component, PropTypes as PT } from 'react';

class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      oldHeight: 0
    }
  }

  // Searching
  searching(e) {
    this.setState({
      searchValue: e.target.value
    });
    // Make it so height jumps aren't dramatic
    if(this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.setState({ 
        oldHeight: this.refs.searchCont.clientHeight
      });
    }, 100);
  }
  
  // Returns filtered results
  filteredItems() {
    const searchValue = this.state.searchValue.toLowerCase(); 
    const { items, searchKey } = this.props;
    
    // nothing in box
    if(!searchValue) {
      return items;
    }
    return items.filter(item => {
      return item[searchKey].toLowerCase().indexOf(searchValue) !== -1
    });
  }

  render() {
    const height = this.state.oldHeight 
                 ? { height: this.state.oldHeight, overflow: 'hidden' } 
                 : { overflow: 'hidden' };
    return (
      <div>
        <div className="clearfix">
          <div className="search-list-input panel panel-invisible">
            <label className="control-label">Quick Filter</label>
            <input className="form-control" 
                   type="text" 
                   value={this.state.searchValue} 
                   onChange={this.searching.bind(this)} />
          </div>
          {this.props.children}
        </div>
        <hr />
        <div className="animate-height" style={height}>
          <ul ref="searchCont" className="list-group">
            {this.filteredItems().map(item => this.props.component(item))}
          </ul>
        </div>
      </div>
    )
  }
}

SearchList.propTypes = {
  items: PT.array.isRequired,
  searchKey: PT.string.isRequired,
  component: PT.func.isRequired
};

export default SearchList