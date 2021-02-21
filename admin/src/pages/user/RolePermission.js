import React,  { Component } from 'react';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
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




class RolePermission extends Component {
  state = {
	id:'',
    rid: '',
    name: '',
    weight: 0,
	permissions: [],
	allPermissions: []
  }
  
  constructor(props) {
    super(props);


    this.handleInputChange = this.handleInputChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handlePermissionChange = this.handlePermissionChange.bind(this);
  }

  handlePermissionChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
	//console.log(value);
	//console.log(name);
	let permissions = this.state.permissions;
	//添加，
	if(value){
	  permissions.push(name);	
	}else{
		//删除
		permissions = permissions.filter(function(item) {
			return item !== name;
		});
	}
	
	this.setState({
      permissions: permissions
    });

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
	//console.log('statesubmit', this.state);

	const  dataURL = config.baseUrl + '/user/role/' + this.state.id;
	var token = localStorage.getItem('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	console.log('token', token);
	var that = this;
	axios.put(dataURL, {
		id: this.state.id,
		permissions: this.state.permissions,
		//headers: { Authorization: `Bearer ${token}` }
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

    event.preventDefault();
  }  
  componentDidMount() {
	this.setTitle();
    this.loadRoleInfo();
	this.loadAllPermissions();	  
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
		  permissions: result.data.permissions,
		});
	  })
      .catch(error => {
		  console.log(error); 
		  });		  
  }  
  loadAllPermissions() {

	const  dataURL = config.baseUrl + '/user/permissions';
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 	
    axios.get(dataURL)
      .then(result => {
		console.log(result.data);  

		this.setState({
		  allPermissions: result.data,
		});
	  })
      .catch(error => {
		  console.log(error); 
	  });		  
  }
  
  setTitle() {
	const { t } = this.props;
	document.title = t('Config permission');	  
  }    
/*  
  static defaultProps = {
    title:"Config permission"
  }   */ 
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
			  
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
             {t(this.state.name)}
            </Typography>			  
            <form className={classes.form} onSubmit={this.handleSubmit}>


				      <Table className={classes.table}>
						<TableHead>
						  <TableRow>
							<TableCell>{t('Permission name')}</TableCell>
							<TableCell align="right">{t('Permission ID')}</TableCell>
							<TableCell align="right">{t('Selected')}</TableCell>

						  </TableRow>
						</TableHead>
						<TableBody>
						  {this.state.allPermissions.map(permission => (
							<TableRow key={permission.key}>
							  <TableCell component="th" scope="row">
								{t(permission.title)}
							  </TableCell>
							  <TableCell align="right">{permission.key}</TableCell>
							  <TableCell align="right">
			                    <Checkbox value={permission.key}  checked={this.state.permissions.indexOf(permission.key) > -1}   name={permission.key}  id={permission.key}  onChange={this.handlePermissionChange} />
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

export default withRouter(withTranslation()(withStyles(styles)(RolePermission)))
