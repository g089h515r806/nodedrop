import React,  { Component } from 'react';
//import { Promise } from 'es6-promise';
//import fetch from 'isomorphic-fetch';
//import fetch from 'isomorphic-fetch';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
//import CssBaseline from '@material-ui/core/CssBaseline';
//import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
//import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
//import Back from '../components/common/Back';
//import Headbar from '../components/Headbar';
import DefaultLayout from '../../layouts/DefaultLayout';
import config from '../../config/config';

//const backgroundShape = require('../images/shape.svg');

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

class UserEdit extends Component {
  state = {
	id:'',
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
	console.log('statesubmit', this.state);


	//const  dataURL = 'http://localhost:3001/api/user/' + this.state.id;
	const  dataURL = config.baseUrl + '/user/' + this.state.id;
	var token = localStorage.getItem('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	console.log('token', token);
	var that = this;
	axios.put(dataURL, {
		id: this.state.id,
		name: this.state.name,
		email: this.state.email,
		password: this.state.password,
		roles: this.state.roles,
		//headers: { Authorization: `Bearer ${token}` }
	  })
	  .then(function (response) {
		console.log(response);
		var errors = (response.data.errors && response.data.errors.email && response.data.errors.email.message) || '';
		if(errors !== ''){
			alert('错误消息：' + errors);
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
    this.loadUserInfo();
	this.loadAllRoles();
		  
  }
  loadUserInfo() {

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
		  id: result.data._id || null,
		  email: result.data.email || "",
		  name: result.data.name || "",
		  roles: result.data.roles || [],
		});
	  })
      .catch(error => {
		  console.log(error); 
		  });		  
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
	document.title = t('Edit user');	  
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
					<InputLabel htmlFor="email">{t('Email')}</InputLabel>
					<Input id="email" name="email" autoComplete="email" autoFocus value={this.state.email} onChange={this.handleInputChange}/>
				  </FormControl>
				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="name">{t('Username')}</InputLabel>
					<Input name="name" type="text" id="name" autoComplete="name" value={this.state.name} onChange={this.handleInputChange}/>
				  </FormControl>
				  
				 <FormControl margin="normal"  fullWidth>
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

export default withRouter(withTranslation()(withStyles(styles)(UserEdit)))