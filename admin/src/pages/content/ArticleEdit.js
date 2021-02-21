import React,  { Component } from 'react';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import MyEditor from '../../components/MyEditor';
import FileUpload from '../../components/FileUpload';
import DefaultLayout from '../../layouts/DefaultLayout';
import config from '../../config/config';


const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    //height: '100vh',
    //overflow: 'auto',
  },
  button: {
    backgroundColor: theme.palette.primary['A100']
  },
  backButton: {
    marginRight: theme.spacing(1) ,
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1)
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'left',
	marginBottom: theme.spacing(2),
	marginTop: theme.spacing(2),
  }, 

  formControl: {
    width: '100%'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },    
  grid: {
    width: 1000
  }
})

class ArticleEdit extends Component {
  state = {
	id:'',
	categorys:[],
	content:{},	
	loaded:false,
  }
  
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	
  }
   
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let content = this.state.content;
	content[name] = value;
    this.setState({
      content: content
    });
	console.log(this.state);
  } 
  
  handleEditorChange(html) {
	let content = this.state.content; 
    content['body'] = (html|| "");	
    this.setState({
      content: content
    });
	
	//console.log("handleEditorChangehtml",html);
  }

  handleImageUpload(files) {
    let image = (files[0] && files[0]._id) || null;
	let content = this.state.content; 
	content['image'] = image;
    this.setState({
      content: content
    });
	
	//console.log(this.state);
  } 
  handleAudioUpload(files) {
    let audio = (files[0] && files[0]._id) || null;
	let content = this.state.content; 
	content['audio'] = audio;
    this.setState({
      content: content
    });
	
	//console.log(this.state);
  }
  handleVideoUpload(files) {
    let video = (files[0] && files[0]._id) || null;
	let content = this.state.content; 
	content['video'] = video;
    this.setState({
      content: content
    });
	
	console.log('handleVideoUpload',files);
  }   
  handleSubmit(event) {
	//console.log('statesubmit', this.state);

	const  dataURL =  config.baseUrl +'/content/' + this.state.id;
	var token = localStorage.getItem('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	

	var that = this;
	let content = this.state.content;
	axios.put(dataURL, content)
	  .then(function (response) {
		//console.log(response);
		that.props.history.replace('/content/article/list');
	  })
	  .catch(function (error) {
		console.log(error);
	  });

    //history.replace('/user/list'); 

    event.preventDefault();
  }  
  //componentWillMount() {
   // this.loadAllTerms(); 
  //}
  
  async loadAllTerms() {
	//let codeArr = "rs_goal,attendee_type,customer_number";
	try{
		let codeArr = [
		  "category",
		];
		const  dataURL = config.baseUrl + '/taxonomy/termsbycodes?codes=' + codeArr.join(",");
		var token = localStorage.getItem('token') || "";
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		const result = await axios.get(dataURL);
		console.log(result.data);
        this.setState({
		  //types: result.data["roadshow"]|| [],
		  categorys: result.data.category|| [],
		})		
		//return response.data;
	}
	catch(error){
		return [];
	};	
   
  }
  componentDidMount() {
	this.setTitle();   
    this.loadAllTerms(); 
	//var that = this;

	const { id } = this.props.match.params;

	const  dataURL = config.baseUrl +'/content/' + id;
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 	
    axios.get(dataURL)
      .then(result => {
		console.log(result.data);  
        //let departmentsOrigin = this.initDepartmentsOrigin(result.data.company,result.data.province);
		//console.log("departmentsOrigin",departmentsOrigin);
		//let hasPermission  = this.checkUserEditPermission(result.data);
		this.setState({
		  id: result.data._id,
		  content: result.data,
          loaded:true,
		});
	})
    .catch(error => {
		  console.log(error); 
	});		  
  }
  setTitle() {
	const { t } = this.props;
	document.title = t('Edit Article');	  
  }   

  render() {
    const { classes, t } = this.props;
    //const currentPath = this.props.location.pathname
   console.log("content", this.state.content);
    return (
      <DefaultLayout title={this.props.title}>
		<main className={classes.content}>	
		<div className={classes.appBarSpacer} />
        <div className={classes.root}>
          <Grid container justify="center"> 
            <Grid spacing={10} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
				<form className={classes.form} onSubmit={this.handleSubmit}>
					<Paper className={classes.paper} elevation={3} >
					<Grid container spacing={3}>

					<Grid item xs={12} sm={12}>		
					  <FormControl margin="normal" fullWidth>
						<InputLabel htmlFor="title">{t('Title')}</InputLabel>
						<Input id="title" name="title" type="text" autoFocus value={this.state.content.title || ""} onChange={this.handleInputChange}/>
					  </FormControl>
					 </Grid>
				   
					<Grid item xs={12} sm={12}>
						<FormControl  margin="normal" className={classes.formControl}>
						<InputLabel htmlFor="category">{t('Category')}</InputLabel>
						<Select native  id="category" name="category" displayEmpty input={<Input />}  value={(this.state.content.category  && this.state.content.category._id)|| ""} onChange={this.handleInputChange}>
						  <option value="" />
						  {this.state.categorys.map(category => {
								return ( <option value={category._id} key={category._id}>{category.name}</option>)
						  })}
						  

						</Select>
					  </FormControl>
					</Grid>
				   
					<Grid item xs={12} sm={12}> 
						<div><label>{t('Body')}</label>
					 {this.state.loaded &&  <MyEditor value={this.state.content.body || ""} onChange={this.handleEditorChange.bind(this)} ref="body" /> }
					  </div>
					</Grid>  
					<Grid item xs={12} sm={12}>  
					 { this.state.loaded && 
					  (
					  <div>
					  <div>
						<InputLabel htmlFor="image">{t('Image')}:</InputLabel>
						 <div><FileUpload name="image" id="image" multiple={false} accept="image/*" files={this.state.content.image &&[this.state.content.image]} onFileUpload={this.handleImageUpload.bind(this)}/> </div>	
					  </div>
					  
					  <div>
						<InputLabel htmlFor="audio">{t('Audio')}:</InputLabel>
						 <div><FileUpload name="audio" id="audio" multiple={false} accept=".mp3" files={this.state.content.audio && [this.state.content.audio]} onFileUpload={this.handleAudioUpload.bind(this)}/> </div>	
					  </div>
					  
					  <div>
						<InputLabel htmlFor="video">{t('Video')}:</InputLabel>
						 <div><FileUpload name="video" id="video" multiple={false} accept=".mp4" files={this.state.content.video &&  [this.state.content.video]} onFileUpload={this.handleVideoUpload.bind(this)}/> </div>	
					  </div></div>)	
					  }
					  </Grid> 
					</Grid> 
					</Paper> 		
					  {<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					  >
					   {t('Save')}
					  </Button>}	
				</form>

              </Grid>
            </Grid>
          </Grid>
        </div>
		 </main>
       </DefaultLayout>
    )
  }
}

export default withRouter(withTranslation()(withStyles(styles)(ArticleEdit)))