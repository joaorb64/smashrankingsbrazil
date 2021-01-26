import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React, { Component } from 'react'
import i18n from '../locales/i18n';

class HelpButton extends Component {
  state = {
    opened: false
  }

  componentDidUpdate(prevProps) {
  }

  componentDidMount() {
    this.modalRef = React.createRef();
  }

  openModal(){
    this.setState({opened: true})
  }

  componentWillUnmount(){
    window.jQuery(this.modalRef.current).remove();
  }

  render (){
    return(
      <div style={{display: "inline-block"}}>
        <div onClick={()=>this.openModal()}
        style={{display: "inline-block", cursor: "pointer", fontSize: "initial", verticalAlign: "middle"}}>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </div>

        <Dialog open={this.state.opened} onClose={()=>{this.setState({opened: false})}}>
          <DialogTitle>
            Help
          </DialogTitle>
          <DialogContent>
            {this.props.content ? this.props.content : ""}
          </DialogContent>
        </Dialog>
      </div>
    )
  }
};

export default HelpButton