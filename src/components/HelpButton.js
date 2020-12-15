import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import i18n from '../locales/i18n';

class HelpButton extends Component {
  state = {
  }

  componentDidUpdate(prevProps) {
  }

  componentDidMount() {
    this.modalRef = React.createRef();
  }

  openModal(){
    window.jQuery(this.modalRef.current).appendTo("body").modal('show');
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

        <div class="modal fade" ref={this.modalRef} id="helpModal" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" style={{color: "white"}}>Help</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body" style={{padding: 20}}>{this.props.content ? this.props.content : ""}
              </div>
              <div class="modal-footer">
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default HelpButton