import React,  { Component } from 'react';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import config from '../../config/config';
import DefaultLayout from '../../layouts/DefaultLayout';

const styles = theme => ({
  root: {
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
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },    
  grid: {
    width: 1000
  }
})




class UserDelete extends Component {
  state = {
	id:'',
    email: '',
    name: '',
    realname: ''
  }
  
  constructor(props) {
    super(props);
    this.state = {
	  id:'',
      email: '',
      name: '',
      realname: ''
    };

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
    //alert('Your favorite flavor is: ' + this.state.email);
	//console.log('statesubmit', this.state);

	const  dataURL = config.baseUrl + '/user/' + this.state.id;
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	
	var that = this;
	axios.delete(dataURL, {
		id: this.state.id
	  })
	  .then(function (response) {
		console.log(response);
		that.props.history.replace('/user/list');
	  })
	  .catch(function (error) {
		console.log(error);
	  });
    //history.replace('/user/list'); 

    event.preventDefault();
  }  
  componentDidMount() {
     this.setTitle();
	 
	const { id } = this.props.match.params;
	//const id = "5ce26645763b4505f838ecf6";  
	//const  dataURL = 'http://localhost:3001/api/user/' + id;
	const  dataURL = config.baseUrl + '/user/' + id;
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	
    axios.get(dataURL)
      .then(result => {
		console.log(result.data);  

		this.setState({
		  id: result.data._id,
		  email: result.data.email,
		  name: result.data.name,
		  realname: result.data.realname,
		});
	  })
      .catch(error => {
		  console.log(error); 
		  });		  
  }
  
  setTitle() {
	const { t } = this.props;
	document.title = t('Delete user');	  
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
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
			  <p>{t('Are you sure that you want to delete user')}: {this.state.name} ?</p>
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

export default withRouter(withTranslation()(withStyles(styles)(UserDelete)))
