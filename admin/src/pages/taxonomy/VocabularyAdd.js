import React,  { Component } from 'react';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
//import history from 'history';
//import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
//import Headbar from '../../components/Headbar';
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
    height: '100vh',
    overflow: 'auto',
  }, 
  grid: {
    margin: theme.spacing(2)
  },
  smallContainer: {
    width: '60%'
  },
  bigContainer: {
    width: '80%'
  },

  buttonBar: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: theme.palette.primary['A100']
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1)
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
  }
})

class VocabularyAdd extends Component {

  state = {
    name: '',
    code: ''
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      code: ''
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
	
	//console.log(this.state);
  } 
  handleSubmit(event) {
    //alert('Your favorite flavor is: ' + this.state.email);
	//console.log('statesubmit', this.state);

    const  dataURL = config.baseUrl + '/taxonomy';	
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 	
	var that = this;
	axios.post(dataURL, {
		name: this.state.name,
		code: this.state.code
	  })
	  .then(function (response) {
		console.log(response);
		that.props.history.replace('/taxonomy/list');
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
	document.title = t('Add vocabulary');	  
  } 


  render() {

    const { classes, t } = this.props;

    return (
     <DefaultLayout title={this.props.title}>
		<main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={classes.root}>

          <Grid container justify="center">
            <Grid spacing={3} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>

				<form className={classes.form} onSubmit={this.handleSubmit}>
				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="name">{t('Vocabulary name')}</InputLabel>
					<Input id="name" name="name" autoComplete="name" autoFocus value={this.state.name} onChange={this.handleInputChange}/>
				  </FormControl>
				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="code">{t('Vocabulary code')}</InputLabel>
					<Input name="code" type="text" id="code" autoComplete="code" value={this.state.code} onChange={this.handleInputChange}/>
				  </FormControl>
				  
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


              </Grid>
            </Grid>
          </Grid>
        </div>
		 </main>
      </DefaultLayout>
    )
  }
}

export default withRouter(withTranslation()(withStyles(styles)(VocabularyAdd)))
