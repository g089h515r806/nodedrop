import React,  { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActionsWrapped from '../../components/TablePaginationActionsWrapped';
import SearchIcon from '@material-ui/icons/Search';
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


const level = ['Emergency','Alert','Critical','Error','Warning','Notice','Info','Debug'];

class LogList extends Component {
  state = {
    rows: [],
      page: 0,
      rowsPerPage: 10,
      count:0,	
	  type:"",
	  username:"",
	  severity:"",
  }	

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
  }  
  componentDidMount() {
	  this.setTitle();
	  this.fetchData();
 
  }
  fetchData() {
	let skip = (this.state.page * this.state.rowsPerPage) || 0;
    const  dataURL = config.baseUrl + '/dblog?'
	+ 'type=' + this.state.type
	+ '&severity=' + this.state.severity
	+ '&username=/' + this.state.username + '/i'
	+ '&skip=' + skip 
	+ '&limit=' + this.state.rowsPerPage
	+ '&sort=-timestamp'
	+ '&withCount=1';

	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 
    //console.log(this.state);
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
	
    this.setState({page: page}, function(){
       this.fetchData(); 
    }.bind(this));	
	
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
	document.title = t('Logs');	  
  }   
     renderSearchForm() {
		const { classes, t } = this.props;  
		return ( 
        <form className={classes.form} onSubmit={this.handleSubmit}>
		  <Paper className={classes.paper} elevation={3} >
          <FormControl margin="normal" variant="filled" className={classes.textfield}>
            <InputLabel htmlFor="type">{t('Type')}</InputLabel>
            <Input id="type" name="type" autoComplete="type" autoFocus value={this.state.type} onChange={this.handleInputChange}/>
          </FormControl>
          <FormControl margin="normal" variant="filled" className={classes.textfield}>
            <InputLabel htmlFor="username">{t('Username')}</InputLabel>
            <Input name="username" type="username" id="username" autoComplete="username" value={this.state.username} onChange={this.handleInputChange}/>
          </FormControl>
		  
      <FormControl className={`${classes.formControl} ${classes.select}`}>
        <InputLabel htmlFor="role-native-simple">{t('Severity')}</InputLabel>
        <Select
          native
		
		  
          value={this.state.severity}
          onChange={this.handleInputChange}
          inputProps={{
            name: 'severity',
            id: 'severity-native-simple',
          }}
        >
          <option value="" />
          <option value={0}>{t('Emergency')}</option>
          <option value={1}>{t('Alert')}</option>
          <option value={2}>{t('Critical')}</option>
		  <option value={3}>{t('Error')}</option>
		  <option value={4}>{t('Warning')}</option>
		  <option value={5}>{t('Notice')}</option>
		  <option value={6}>{t('Info')}</option>
		  <option value={7}>{t('Debug')}</option>
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
                    <div>{this.renderSearchForm() }</div>
				 
				      <Table className={classes.table}>
						<TableHead>
						  <TableRow>
							<TableCell>{t('Type')}</TableCell>
							<TableCell align="right">{t('User')}</TableCell>
							<TableCell align="right">{t('Log message')}</TableCell>
							<TableCell align="right">{t('Severity')}</TableCell>
							<TableCell align="right">{t('Hostname')}</TableCell>
							<TableCell align="right">{t('Date')}</TableCell>
						  </TableRow>
						</TableHead>
						<TableBody>
						  {this.state.rows.map(row => (
							<TableRow key={row._id}>
							  <TableCell component="th" scope="row">
								{row.type}
							  </TableCell>
							  <TableCell align="right">{row.username}</TableCell>
							  <TableCell align="right">{row.message}</TableCell>
							  <TableCell align="right">{t(level[row.severity]) || t(row.severity)}</TableCell>
							  <TableCell align="right">{row.hostname}</TableCell>
							  <TableCell align="right">{ moment(row.timestamp).format('YYYY-MM-DD HH:mm')}</TableCell>
							</TableRow>
						  ))}
						</TableBody>
						
                        <TableFooter>
						  <TableRow>
							<TablePagination
							  rowsPerPageOptions={[10, 20, 30,50,100]}
							  
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

export default withTranslation()(withStyles(styles)(LogList));