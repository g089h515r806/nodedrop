import React,  { Component } from 'react';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DefaultLayout from '../../layouts/DefaultLayout';
import config from '../../config/config';


const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.palette.grey['A500'],
    overflow: 'hidden',

    marginTop: 20,
    padding: 20,
    paddingBottom: 200		
  },
  appBarSpacer: theme.mixins.toolbar,  
  button: {
    backgroundColor: theme.palette.primary['A100']
  },
  formControl: {
    width: '100%'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop:  theme.spacing(1),
  },
  submit: {
    marginTop:  theme.spacing(3),
  },    
  grid: {
    width: 1000
  }
})




class ArticleDelete extends Component {
  state = {
	id:'',
    content: {},
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

    this.setState({
      [name]: value
    });
	
	console.log(this.state);
  } 
  handleSubmit(event) {

    const  dataURL = config.baseUrl + '/content/' + this.state.id;
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 	
	var that = this;
	axios.delete(dataURL, {
		id: this.state.id
	  })
	  .then(function (response) {
		console.log(response);
		that.props.history.replace('/content/article/list');
	  })
	  .catch(function (error) {
		console.log(error);
	  });
    //history.replace('/user/list'); 

    event.preventDefault();
  }  
  componentDidMount() {
    this.setTitle();
	//var that = this;

	const { id } = this.props.match.params;

	//const  dataURL = 'http://localhost:3001/api/taxonomy/' + id;
	const  dataURL = config.baseUrl +'/content/' + id;
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 	
    axios.get(dataURL)
      .then(result => {
		//console.log(result.data);  

		this.setState({
		  id: id,
		  content:result.data,
		});
	  })
      .catch(error => {
		  console.log(error); 
		  });		  
  }
  setTitle() {
	const { t } = this.props;
	document.title = t('Delete article');	  
  }
  render() {
    const { classes, t } = this.props;
    //const currentPath = this.props.location.pathname

    return (
      <DefaultLayout title={this.props.title}>
		<main className={classes.content}>	
		<div className={classes.appBarSpacer} />
        <div className={classes.root}>
          <Grid container justify="center"> 
            <Grid spacing={3} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
			  <p>{t('Are you sure that you want to delete article')}: {(this.state.content && this.state.content.title) || ""} ?</p>
				<form className={classes.form} onSubmit={this.handleSubmit}>
				  
				  <Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
				  >
				   {t('Delete')}
				  </Button>
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

export default withRouter(withTranslation()(withStyles(styles)(ArticleDelete)))