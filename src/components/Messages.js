import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { actions } from 'redux/modules/messageReducer';


class Messages extends Component {

  // First mount
  componentDidMount() {
    if(this.props.messages.length) {
      this.props.actions.messagesSeen();
    }
  }

  // Data updates
  componentWillReceiveProps(nextProps) {
    if(nextProps.messages.length) {
      this.props.actions.messagesSeen();
    }
  }

  componentWillUnmount() {
    // Clear on exit
    this.props.actions.messageDismissAll();
  }

  render() {
    const { messages } = this.props;
    const messageMarkup = (message, index) => {
      return <div key={index.toString()} className={`alert alert-${message.level}`}>{message.content}</div>
    }
    return (
      <div className="govready-messages">
        {messages.map((message, index) => messageMarkup(message, index))}
      </div>
    )
  }
}

Messages.propTypes = {
  actions: PT.object.isRequired,
  messages: PT.array.isRequired
};

function mapStateToProps (state) {
  return {
    messages: state.messageState.messages
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
