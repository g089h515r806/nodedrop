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
import DefaultLayout from '../../layouts/DefaultLayout';
import config from '../../config/config';


const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  button: {
    backgroundColor: theme.palette.primary['A100']
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 42
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




class RoleEdit extends Component {
  state = {
	id:'',
    rid: '',
    name: '',
    weight: 0
  }
  
  constructor(props) {
    super(props);


    this.handleInputChange = this.handleInputChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	//this.handlePermissionChange = this.handlePermissionChange.bind(this);
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
	console.log('statesubmit', this.state);


	//const  dataURL = 'http://localhost:3001/api/user/' + this.state.id;
	const  dataURL = config.baseUrl + '/user/role/' + this.state.id;
	var token = localStorage.getItem('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	console.log('token', token);
	var that = this;
	axios.put(dataURL, {
		id: this.state.id,
		rid: this.state.rid,
		name: this.state.name,
		weight: this.state.weight,
	  })
	  .then(function (response) {
		console.log(response);
		var errors = (response.data.errors && response.data.errors.email && response.data.errors.email.message) || '';
		if(errors !== ''){
			alert('错误消息：' + errors);
		}else{
		  that.props.history.replace('/user/role/list');
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
    this.loadRoleInfo();  
  }
  loadRoleInfo() {

	const { id } = this.props.match.params;
	const  dataURL = config.baseUrl + '/user/role/' + id;
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 	
    axios.get(dataURL)
      .then(result => {
		console.log(result.data);  

		this.setState({
		  id: result.data._id,
		  rid: result.data.rid,
		  name: result.data.name,
		  weight: result.data.weight,
		  //permissions: result.data.permissions,
		});
	  })
      .catch(error => {
		  console.log(error); 
		  });		  
  }
  
  setTitle() {
	const { t } = this.props;
	document.title = t('Edit role');	  
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
				<form className={classes.form} onSubmit={this.handleSubmit}>
				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="rid">{t('Role ID')}</InputLabel>
					<Input id="rid" name="rid" autoComplete="rid" autoFocus value={this.state.rid} onChange={this.handleInputChange}/>
				  </FormControl>
				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="name">{t('Role name')}</InputLabel>
					<Input name="name" type="text" id="name" autoComplete="name" value={this.state.name} onChange={this.handleInputChange}/>
				  </FormControl>
				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="weight">{t('Weight')}</InputLabel>
					<Input name="weight" type="text" id="weight" autoComplete="weight" value={this.state.weight} onChange={this.handleInputChange}/>
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

export default withRouter(withTranslation()(withStyles(styles)(RoleEdit)))
