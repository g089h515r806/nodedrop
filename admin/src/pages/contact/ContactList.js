import React,  { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
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
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
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


class ContactList extends Component {
  state = {
    rows: [],
    page: 0,
    rowsPerPage: 10,
    count:0,	
	//type:"",
	name:"",
	phone:"",
    dateStart: moment().subtract(365, 'days').format('YYYY-MM-DD'),
    dateEnd: moment().add(1, 'days').format('YYYY-MM-DD'),		  
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
    const  dataURL = config.baseUrl + '/contact?'
	+ 'name=/' + this.state.name + '/i'
	+ '&phone=/' + this.state.phone + '/i'
	+ '&created>=' + this.state.dateStart 
	+ '&created<=' + this.state.dateEnd 
	+ '&skip=' + skip 
	+ '&limit=' + this.state.rowsPerPage
	+ '&sort=-created'
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
      page:0, //	  
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
	document.title = t('Contacts');	  
  }  
 
     renderSearchForm() {
		const { classes, t } = this.props;  
		return ( 
        <form className={classes.form} onSubmit={this.handleSubmit}>
		  <Paper className={classes.paper} elevation={3} >
		<Grid container spacing={3}>  
		<Grid item xs={6} sm={2}>  
          <FormControl margin="normal" variant="filled" className={classes.textfield}>
            <InputLabel htmlFor="name">{t('Name')}</InputLabel>
            <Input id="name" name="name" autoComplete="name" autoFocus value={this.state.name} onChange={this.handleInputChange}/>
          </FormControl>
		</Grid> 
        <Grid item xs={6} sm={2}>		
          <FormControl margin="normal" variant="filled" className={classes.textfield}>
            <InputLabel htmlFor="phone">{t('Phone')}</InputLabel>
            <Input name="phone" id="phone" autoComplete="phone" value={this.state.phone} onChange={this.handleInputChange}/>
          </FormControl>
		</Grid>   
	  <Grid item xs={6} sm={2}>
		<TextField
			id="dateStart"
			name="dateStart"
			label={t('Start date')}
			type="date"
			value={this.state.dateStart}
			 margin="normal"
			onChange={this.handleInputChange}
			className={classes.textField}
			InputLabelProps={{
			  shrink: true,
			}}
		  />
	   </Grid>
	  <Grid item xs={6} sm={2}>
		<TextField
			id="dateEnd"
			name="dateEnd"
			label={t('End date')}
			type="date"
			value={this.state.dateEnd}
			 margin="normal"
			onChange={this.handleInputChange}
			className={classes.textField}
			InputLabelProps={{
			  shrink: true,
			}}
		  /> 
	   </Grid>
       <Grid item xs={6} sm={2}>	   
          <Button
            type="submit"
            className={classes.submit}
            variant="contained"
            color="primary"
            startIcon={<SearchIcon/>}
          >
           {t('Search')}
          </Button>
		   </Grid>
		    </Grid>
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
							<TableCell align="center">{t('Name')}</TableCell>
							<TableCell align="center">{t('Phone')}</TableCell>
							<TableCell align="center">{t('Content')}</TableCell>
							<TableCell align="center">{t('Time')}</TableCell>
							<TableCell align="right">{t('Edit')}</TableCell>
							<TableCell align="right">{t('Delete')}</TableCell>							
						  </TableRow>
						</TableHead>
						<TableBody>
						  {this.state.rows.map(row => (
							<TableRow key={row._id}>
							  <TableCell align="center">
								{row.name}
							  </TableCell>
							  <TableCell align="center">{row.phone}</TableCell>
							  <TableCell align="left">{row.content}</TableCell>
							  <TableCell align="center">{ moment(row.created).format('YYYY-MM-DD HH:mm')}</TableCell>
							  <TableCell align="right"><Link to={`/contact/${row._id}/edit`}><EditIcon/></Link></TableCell>
							  <TableCell align="right"><Link to={`/contact/${row._id}/delete`}><DeleteForeverIcon/></Link></TableCell>							  
							</TableRow>
						  ))}
						</TableBody>
						
                        <TableFooter>
						  <TableRow>
							<TablePagination
							  rowsPerPageOptions={[10, 20, 30,50,100]}
							  colSpan={7}
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

export default withTranslation()(withStyles(styles)(ContactList));