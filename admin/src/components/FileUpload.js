import React,  { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import config from '../config/config';

const styles = theme => ({
  uploadWrapper: {
    width: "100%",
  },
  table: {
  },  
  avatarImageStyle: {
    width: 100,
    height: 100,
  }   
})
class FileUpload extends Component {
  state = {
    files: [],
  }
  componentWillMount() {
    let { files } = this.props;
	files = files || [];
	//console.log('files',files);
	//console.log('props',this.props);
	this.setState({ 
		files : files  
	});	
  }

  onDropFile (acceptedFiles, rejectedFiles){
	  //console.log('123123abc'); 
	 //console.log(acceptedFiles); 
	const { onFileUpload} = this.props;
	let that = this; 
    let files = acceptedFiles.map(async file => {
        let data = new FormData();
        data.append("file", file);
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 
        let item = await axios
          .post(config.baseUrl + "/file/upload", data, {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
          .then(response => {
			console.log("response", response.data);
            return Object.assign(file, response.data);
          })
          .catch(err => {
            //let rejects = rejectedFiles.map(async file => {
			rejectedFiles.map(async file => {	
              //let data = new FormData();
              //await data.append("file", file);

              console.log("There was an error while attempting to add your files:", err);
              //console.log("The files that were rejected were:\n", rejects.join('\n'))
            })
          });
        return item;
      });
      Promise.all(files)
      .then(completed => {
        //console.log("completed", completed);
		var filesTem = that.state.files;
		
		that.setState({ 
		    files: filesTem.concat(completed)  
		  },() => {
            onFileUpload(this.state.files);
          },
		);

      })
      .catch(err => {
        console.log('DROPZONE ERROR:', err);
      });	 
	 
  } 

  removeFile(file){
	const { onFileUpload} = this.props;
	var files = this.state.files || [];
	files = files.filter(function(itemTmp) {
		return itemTmp._id !== file._id;
    });
    this.setState({
      files: files,
    },() => {
         onFileUpload(this.state.files);
    },);	
  } 

  convertUriToUrl(uri){
    uri = uri || "";
	let prefix = config.staticBaseUrl + "/";
	return uri.replace("public://",prefix);  
  }  
  render() {
    const { classes, t, multiple=false, accept, type="file",  maxSize} = this.props;
    //const { classes } = this.props;  
    let showDropzone = true;
	//let multiple = false;
	//let type = "image";
	if(this.state.files.length > 0 && multiple===false){
		showDropzone = false;
	}
    return (
	  <>
		<div className={classes.uploadWrapper}>		
		<div>
				    {this.state.files.length> 0 &&   <Table className={classes.table}>
						<TableHead>
						  <TableRow>
							<TableCell>{t('File')}</TableCell>
							<TableCell align="right">{t('Delete')}</TableCell>
						  </TableRow>
						</TableHead>
						<TableBody>
						  {this.state.files.map(file => (
							<TableRow key={file._id}>
							  <TableCell component="th" scope="row">
							  {type === "image" &&  <a href={this.convertUriToUrl(file.uri)} target="_blank"  rel="noopener noreferrer"><Avatar src={this.convertUriToUrl(file.uri)} className={classes.avatarImageStyle}/></a> }
							  {type !== "image" &&  <a href={this.convertUriToUrl(file.uri)} target="_blank"  rel="noopener noreferrer">{file.filename }</a> }
							  </TableCell>
							  <TableCell align="right">
							     <Button variant="contained" className={classes.deleteBtn} onClick={this.removeFile.bind(this,file)}>
								   {t('Delete')}
								  </Button>
							  </TableCell>
							</TableRow>
						  ))}
						</TableBody>
                      </Table>}							
		</div>
		{showDropzone && <Dropzone onDrop={this.onDropFile.bind(this)} maxSize={maxSize} multiple={multiple}  accept={accept}>
		  {({getRootProps, getInputProps}) => (
			  <div {...getRootProps()}>
				<input {...getInputProps()} />
				<p>{t("Drag 'n' drop some files here, or click to select files")}</p> 
			  </div>
		  )}
		</Dropzone>	}

		</div>	
	  </>
    )
  }
}

FileUpload.propTypes  ={
	onFileUpload: PropTypes.func.isRequired,
    multiple:PropTypes.bool,
	accept:PropTypes.string,
	type:PropTypes.string,
	files:PropTypes.array,
	maxSize:PropTypes.number,
}
export default withTranslation()(withStyles(styles)(FileUpload));
