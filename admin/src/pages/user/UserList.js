import React,  { Component } from 'react';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
//import CssBaseline from '@material-ui/core/CssBaseline';
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActionsWrapped from '../../components/TablePaginationActionsWrapped';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
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
    overflow: 'auto',
  },
  textfield:{
	marginRight:theme.spacing(2),
  },
  submit:{
	marginTop:theme.spacing(3),
  }, 
  select:{
	marginTop:theme.spacing(2),
	marginRight:theme.spacing(2),
  }, 
  paper:{
	padding: theme.spacing(1),
	marginBottom: theme.spacing(2),
	marginTop: theme.spacing(2),
  },   
})


class UserList extends Component {
  state = {
    rows: []
  }
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      page: 0,
      rowsPerPage: 10,
      count:0,	  	
      name: '',
      email: '',
	  role: '',
	  roles: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
	 this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
  }  

  checkLogin() {
	let accountInfo = false;
    let accountInfoRaw = localStorage.getItem('accountInfo');
	//console.log(accountInfoRaw);
    //console.log(typeof(accountInfoRaw));
    if (typeof(accountInfoRaw) == 'string') {
      accountInfo = JSON.parse(accountInfoRaw);
    }	  

	let uid = accountInfo.id || '';
	if(uid){
		//this.setState({userId: uid}, () => { 
		//  this.loadItems(0);
		//});		
      
	}else{
		this.props.history.replace('/user/login');
	}

  }   
  componentDidMount() {
	   this.setTitle();
	   this.fetchRoles();
	   this.fetchData();

  }
  fetchRoles() {
    const  dataURL = config.baseUrl + '/user/role';
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	  
 axios.get(dataURL)
      .then(result => {
		console.log(result.data);  
		this.setState({
		  roles: result.data
		});		
	  })
      .catch(error => {
		  console.log(error); 
		  });
  }		  
  fetchData() {
	let skip = (this.state.page * this.state.rowsPerPage) || 0;
    const  dataURL = config.baseUrl + '/user?'
	+ 'name=/' + this.state.name + '/i'
	+ '&email=/' + this.state.email + '/i'
	+ '&roles=' + this.state.role 
	+ '&skip=' + skip 
	+ '&limit=' + this.state.rowsPerPage
	+ '&sort=-created'
	+ '&withCount=1';

	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get(dataURL)
      .then(result => {
        console.log(result.data);
		this.setState({
		  rows: result.data.items || [],
		  count: result.data.count || 0,
		});		
	  })
      .catch(error => {
		  console.log(error); 
		  });
  
	//event.preventDefault();
  }  


  handleChangePage = (event, page) => {
	  //console.log( page);
    //this.setState({ page: page});
	
    this.setState({page: page}, function(){
       this.fetchData(); 
    }.bind(this));	
	
	//console.log( this.state);
  };

  handleChangeRowsPerPage = event => {
    this.setState({ 
	  rowsPerPage: event.target.value,
      page:0, //重置页码	  
	}, function(){
       this.fetchData(); 
    }.bind(this));
  };  
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
	
	//console.log(this.state);
  }
  handleChange(name, event) {
    const target = event.target;
    const value =target.value;

    this.setState({
      [name]: value
    });
	
	//console.log(this.state);
  }  
  handleSubmit(event) {

    this.setState({
        page: 0,
	}, function(){
       this.fetchData(); 
    }.bind(this));
	

	event.preventDefault();
  }

  setTitle() {
	const { t } = this.props;
	document.title = t('Users');	  
  }    
     renderSearchForm() {
		const { classes, t } = this.props;  
		return ( 
        <form className={classes.form} onSubmit={this.handleSubmit}>
		<Paper className={classes.paper} elevation={3} >
          <FormControl margin="normal" variant="filled" className={classes.textfield}>
            <InputLabel htmlFor="name">{t('Username')}</InputLabel>
            <Input id="name" name="name" autoComplete="name" autoFocus value={this.state.name} onChange={this.handleInputChange}/>
          </FormControl>
          <FormControl margin="normal" variant="filled" className={classes.textfield}>
            <InputLabel htmlFor="email">{t('Email')}</InputLabel>
            <Input name="email" type="text" id="email" autoComplete="email" value={this.state.email} onChange={this.handleInputChange}/>
          </FormControl>
		  
      <FormControl className={`${classes.formControl} ${classes.select}`}>
        <InputLabel htmlFor="role-native-simple">{t('Role')}</InputLabel>
        <Select
          native
		
		  
          value={this.state.role}
          onChange={this.handleInputChange}
          inputProps={{
            name: 'role',
            id: 'role-native-simple',
          }}
        >
          <option value="" />
			 {this.state.roles.map(role => {
			   return ( <option value={role.rid} key={role.rid}>{role.name}</option>)
			 })}

        </Select>
      </FormControl>		  
          <Button
            type="submit"
            className={classes.submit}
            variant="contained"
            color="primary"
            startIcon={<SearchIcon/>}
          >
           {t('Search')}
          </Button>
		  </Paper>
        </form> 
	   )
	 }
  render() {
    const { classes, t } = this.props;
    //const currentPath = this.props.location.pathname;
	
    const {  rowsPerPage, page, count } = this.state;	
	//console.log(this.props.title);

    return (
     <DefaultLayout title={this.props.title}>
		<main className={classes.content}>
		<div className={classes.appBarSpacer} />
        <div className={classes.root}>
          <Grid container justify="center"> 
            <Grid alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
          <Button
            variant="contained"
            className={classes.add}
			startIcon={<AddIcon/>}
			component={Link} to="/user/add"
          >
           {t('Add user')}
          </Button>
				
				 <div>{this.renderSearchForm() }</div>
				      <Table className={classes.table}>
						<TableHead>
						  <TableRow>
							<TableCell>{t('Username')}</TableCell>
							<TableCell align="right">{t('Email')}</TableCell>

							<TableCell align="right">{t('Edit')}</TableCell>
							<TableCell align="right">{t('Delete')}</TableCell>
						  </TableRow>
						</TableHead>
						<TableBody>
						  {this.state.rows.map(row => (
							<TableRow key={row._id}>
							  <TableCell component="th" scope="row">
								{row.name}
							  </TableCell>
							  <TableCell align="right">{row.email}</TableCell>
							  <TableCell align="right"><Link to={`/user/${row._id}/edit`}><EditIcon/></Link></TableCell>
							  <TableCell align="right"><Link to={`/user/${row._id}/delete`}><DeleteForeverIcon/></Link></TableCell>
							</TableRow>
						  ))}
						</TableBody>
						
                        <TableFooter>
						  <TableRow>
							<TablePagination
							  rowsPerPageOptions={[10, 20, 30,50,100]}
							  colSpan={3}
							  count={count}
							  rowsPerPage={rowsPerPage}
							  page={page}
							  labelRowsPerPage={t('Rows per page')}
							  SelectProps={{
								//label: '每页行数', 
								inputProps: { 'aria-label': t('Rows per page') },
								native: true,
							  }}
							  onChangePage={this.handleChangePage}
							  onChangeRowsPerPage={this.handleChangeRowsPerPage}
							  ActionsComponent={TablePaginationActionsWrapped}
							/>
						  </TableRow>
						</TableFooter>								
					  </Table>
              </Grid>
            </Grid>
          </Grid>
        </div>
		 </main>
      </DefaultLayout>
    )
  }
}

export default withTranslation()(withStyles(styles)(UserList));