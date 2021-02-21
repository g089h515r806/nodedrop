import React,  { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
//import BraftEditor from 'braft-editor'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import config from '../config/config';

const styles = theme => ({
  editorWrapper: {
    boxSizing: "border-box",
    border: "1px solid #ddd",
    cursor: "text",
    padding: "16px",
    borderRadius: "2px",
    marginBottom: "2em",
    boxShadow: "inset 0px 1px 8px -3px #ABABAB",
    background: "#fefefe",	  
  }, 
  myEditor: {
    maxHeight: 300,
	overflow:"scroll",
	border: "1px solid #F1F1F1",
	padding:10,
  },
  
  avatarImageStyle: {
    width: 100,
    height: 100,
  }   
})


class MyEditor extends Component {
  constructor(props) {
    super(props);
      this.state = {
        editorState:EditorState.createEmpty(),
      };	
  }	
  async componentDidMount () {
     const { value } = this.props;
	//console.log("componentDidMount",value);
    //const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
    const contentBlock = await htmlToDraft(value);
	//console.log("contentBlock",contentBlock);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
	  //console.log('editorState',editorState);
      this.setState({
        editorState,
      });
    }
  }  


  onEditorStateChange: Function = (editorState) => {
	const { onChange} = this.props;
    this.setState({
      editorState,
    },() => {
	   let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
       onChange(html);
    });
  };
  uploadImageCallBack(file) {

	  return new Promise(
		(resolve, reject) => {
          let data = new FormData();
          data.append("file", file);
	      var token = localStorage.getItem('token') || "";
	      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 
          axios
          .post(config.baseUrl + "/file/upload", data, {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
          .then(response => {
			console.log("response", response.data);
			
			//uri: "public://upload/file/2020-03/front-active.png"
			let uri  = response.data.uri || "";
			if(uri){
			  	let prefix = config.staticBaseUrl + "/";
	            let url = uri.replace("public://",prefix); 	
				resolve({data: { link: url}});
			}else{
			  let error ={msg:"无效的URL",errorCode:"errorUri"}
			  reject(error);	
			}
			
            //return Object.assign(file, response.data);
          })
          .catch(err => {
			console.log("There was an error while attempting to add your file:", err);
            reject(err);
          });
		}
	  );
		  
  }
  render() {
	const { classes} = this.props;  
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName={classes.myWrapper}
          editorClassName={classes.myEditor}
          onEditorStateChange={this.onEditorStateChange}
		  
		  toolbar={{
			  image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: false } },
			}}
		  
        />

      </div>
    );
  }

}

MyEditor.propTypes  ={
	onChange: PropTypes.func.isRequired,
	value:PropTypes.string,
}
export default withStyles(styles)(MyEditor);
