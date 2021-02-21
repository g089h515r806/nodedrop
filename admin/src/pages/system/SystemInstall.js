import React,  { Component } from 'react';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
//import history from 'history';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import config from '../../config/config';


const backgroundShape = require('../../images/shape.svg');


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary['A100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    marginTop: 10,
    padding: 20,
    paddingBottom: 500
  },
  smallContainer: {
    width: '60%'
  },
  bigContainer: {
    width: '80%'
  },
  logo: {
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
	textAlign: 'center',
  },  
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },  
  formControl: {
    width: '100%'
  },
  form: {
    //width: '100%', // Fix IE 11 issue.
	maxWidth:480,
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  }
})

class SystemInstall extends Component {

  state = {
    email: '',
    name: '',
	password: ''
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
	
	//console.log(this.state);
  } 
  handleSubmit(event) {

	const  dataURL = config.baseUrl + '/system/install';

	var that = this;
	axios.post(dataURL, {
		name: this.state.name,
		email: this.state.email,
		password: this.state.password,
	  })
	  .then(function (response) {
		console.log(response);
		var error = response.data.error || '';
		if(error === true){
			var message = response.data.message || '';
			alert( message);
		}else{
		  that.props.history.replace('/user/login');
		}
	  })
	  .catch(function (error) {
		console.log(error);
	  });
    //history.replace('/user/list'); 

    event.preventDefault();
  }  
  componentDidMount() {
    this.setTitle();
	this.checkInstalled();
  }
  checkInstalled() {
	const  dataURL = config.baseUrl + '/system/installed';
    var that = this;	
    axios.get(dataURL)
      .then(result => {
		console.log(result.data);  
        let installed = result.data.installed || false;
		if(installed===true){
			that.props.history.replace('/user/login');
		}
	  })
      .catch(error => {
		  console.log(error); 
	  });
  } 
  setTitle() {
	const { t } = this.props;
	document.title = t('Install system');	  
  } 


  render() {

    const { classes, t } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>

          <Grid container justify="center">
            <Grid spacing={10} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {t('Install system')}
            </Typography>
                <div className={classes.formContainer}>

				<form className={classes.form} onSubmit={this.handleSubmit}>
				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="email">{t('Email')}</InputLabel>
					<Input id="email" name="email" autoComplete="email" autoFocus value={this.state.email} onChange={this.handleInputChange}/>
				  </FormControl>
				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="name">{t('Username')}</InputLabel>
					<Input name="name" type="text" id="name" autoComplete="name" value={this.state.name} onChange={this.handleInputChange}/>
				  </FormControl>

				 <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="password">{t('Password')}</InputLabel>
					<Input  name='password' type='password' value={this.state.password} onChange={this.handleInputChange} />	
				 </FormControl>			  
				  <Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
				  >
				   {t('Install')}
				  </Button>
				</form>

                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withTranslation()(withStyles(styles)(SystemInstall)))
