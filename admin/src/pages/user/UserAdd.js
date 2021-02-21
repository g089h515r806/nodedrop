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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
//import TextField from '@material-ui/core/TextField';
/*import Back from '../components/common/Back'; */
//import Headbar from '../components/Headbar';
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
  grid: {
    margin: `0 ${theme.spacing.unit * 2}px`
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
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  }
})

class UserAdd extends Component {

  state = {
    email: '',
    name: '',
	password: '',
	roles: [],
	allRoles:[]
  }
  
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handleRoleChange = this.handleRoleChange.bind(this);
  }
  
  handleRoleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
	//console.log(value);
	//console.log(name);
	let roles = this.state.roles;
	//添加，
	if(value){
	  roles.push(name);	
	}else{
		//删除
		roles = roles.filter(function(item) {
			return item !== name;
		});
	}
	
	this.setState({
      roles: roles
    });
	
	//console.log(this.state);
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


	//const  dataURL = 'http://localhost:3001/api/user';
	const  dataURL = config.baseUrl + '/user';
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	
	var that = this;
	axios.post(dataURL, {
		name: this.state.name,
		email: this.state.email,
		password: this.state.password,
		roles: this.state.roles,
	  })
	  .then(function (response) {
		console.log(response);
		var error = response.data.error || false;
		if(error === true){
			var message = response.data.message || false;
			alert(message);
		}else{
		  that.props.history.replace('/user/list');
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
    this.loadAllRoles();
  }
  
  loadAllRoles() {

	const  dataURL = config.baseUrl + '/user/role';
	var token = localStorage.getItem('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;		
    axios.get(dataURL)
      .then(result => {
		console.log(result.data);  

		this.setState({
		  allRoles: result.data,
		});
	  })
      .catch(error => {
		  console.log(error); 
	  });		  
  }
  setTitle() {
	const { t } = this.props;
	document.title = t('Add user');	  
  }   
 

  render() {

    const { classes, t } = this.props;

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

							  <Table className={classes.table}>
								<TableHead>
								  <TableRow>
									<TableCell>{t('Role')}</TableCell>
									<TableCell align="right">{t('Selected')}</TableCell>

								  </TableRow>
								</TableHead>
								<TableBody>
								  {this.state.allRoles.map(role => (
									<TableRow key={role.rid}>
									  <TableCell component="th" scope="row">
										{t(role.name)}
									  </TableCell>
									  <TableCell align="right">
					<Checkbox value={role.rid}  checked={this.state.roles.indexOf(role.rid) > -1}   name={role.rid}  id={role.rid}  onChange={this.handleRoleChange} />
					</TableCell>
									</TableRow>
								  ))}
								</TableBody>
							  </Table>	
				 
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

export default withRouter(withTranslation()(withStyles(styles)(UserAdd)))
