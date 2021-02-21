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
import Paper from '@material-ui/core/Paper';
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


class PageAdd extends Component {

  state = {
    content:{},
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
	
	//console.log(this.state);
  } 
  handleSubmit(event) {

	
    const  dataURL = config.baseUrl + '/content';
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 	
		
	var that = this;
	let content = this.state.content;
	content['type'] = "Page";
	axios.post(dataURL, content)
	  .then(function (response) {
		//console.log(response);
		that.props.history.replace('/content/page/list');
	  })
	  .catch(function (error) {
		console.log(error);
	  });
    //history.replace('/user/list'); 

    event.preventDefault();
  } 

  componentDidMount() {
    this.setTitle();
  }
  setTitle() {
	const { t } = this.props;
	document.title = t('Add page');	  
  }
/*
static defaultProps = {
        title:"Add Page"
}  */ 

  render() {

    const { classes, t } = this.props;

    return (
     <DefaultLayout title={this.props.title}>
		<main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={classes.root}>

          <Grid container justify="center">
            <Grid spacing={10} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <div className={classes.stepContainer}>

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
					  <FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="body">{t('Body')}</InputLabel>
						<Input name="body" type="text" id="body" multiline={true} rows={4} value={this.state.content.body || ""} onChange={this.handleInputChange}/>
					  </FormControl>
					  </Grid>	   


					</Grid> 
					</Paper> 		
					  <Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					  >
					   {t('Save')}
					  </Button>		
				 
				</form>

                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
		 </main>
      </DefaultLayout>
    )
  }
}

export default withRouter(withTranslation()(withStyles(styles)(PageAdd)))
