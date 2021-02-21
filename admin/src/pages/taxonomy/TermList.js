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
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
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
    padding: theme.spacing.unit * 3,
    //height: '100vh',
    overflow: 'auto',
  },
  button: {
    backgroundColor: theme.palette.primary['A100']
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit
  },
  paper:{
	padding: theme.spacing(1),
	marginBottom: theme.spacing(2),
	marginTop: theme.spacing(2),
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
  }  
})

class VocabularyList extends Component {
  state = {
    rows: [],
    page: 0,
    rowsPerPage: 10,	
	count:0,
	vid: '',
	name: '',
    code: '',
	
  }
  
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      page: 0,
      rowsPerPage: 10,
      count:0,	  
	  vid: '',		
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
	//从第一页开始
    this.setState({
        page: 0,
	}, function(){
       this.fetchData(); 
    }.bind(this));
	
	/*
    const  dataURL = config.baseUrl + '/taxonomy/' + this.state.vid + '/terms?name=' + this.state.name + '&code=' + this.state.code;	
	//const  dataURL = config.baseUrl +  '/taxonomy/' + vid + '/terms';
	console.log(dataURL);
    axios.get(dataURL)
      .then(result => {
		console.log(result.data);  
		this.setState({
		  rows: result.data
		});		
	  })
      .catch(error => {
		  console.log(error); 
		  });
	*/	  
	event.preventDefault();
  }  
  
  componentDidMount() {
    this.setTitle();
    //const  dataURL = config.baseUrl + 'http://localhost:3001/api/taxonomy';

	const { vid } = this.props.match.params;
	//this.setState({
	//	  vid: vid
	//});	
    this.setState({vid: vid}, function(){
       this.fetchData(); 
    }.bind(this));


  }

  setTitle() {
	const { t } = this.props;
	document.title = t('Term list');	  
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

  fetchData() {
    //alert('Your favorite flavor is: ' + this.state.email);
	//console.log('statesubmit', this.state);
	let skip = (this.state.page * this.state.rowsPerPage) || 0;
    const  dataURL = config.baseUrl + '/taxonomy/' + this.state.vid + '/terms?'
	+ 'vocabulary=' + this.state.vid 
	+ '&name=/' + this.state.name + '/i'
	+ '&code=/' + this.state.code + '/i'
	+ '&skip=' + skip 
	+ '&limit=' + this.state.rowsPerPage
	+ '&sort=-weight'
	+ '&withCount=1';

	//console.log(dataURL);
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 
    axios.get(dataURL)
      .then(result => {
		//console.log(result.data);  
		//console.log(result);  
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
  
  render() {
    const { classes, t } = this.props;
    //const currentPath = this.props.location.pathname;
	
    const {  rowsPerPage, page, count } = this.state;
    //const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);	
	//console.log(this.props.title);

    return (
     <DefaultLayout title={this.props.title}>
		<main className={classes.content}>
		<div className={classes.appBarSpacer} />
        <div className={classes.root}>
          <Grid container justify="center"> 
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
          <Button
            variant="contained"
            className={classes.add}
			startIcon={<AddIcon/>}
			//href="/service/survey/add"
			component={Link} to={`/taxonomy/term/add/${this.state.vid}`}
          >
           {t('Add term')}
          </Button>
				
				 
				 
			<form className={classes.form} onSubmit={this.handleSubmit}>
				<Paper className={classes.paper} elevation={3} >
					<Grid container spacing={3}>

					<Grid item xs={6} sm={3}>  
					  <FormControl margin="normal" fullWidth>
						<InputLabel htmlFor="name">{t('Term name')}</InputLabel>
						<Input id="name" name="name" autoComplete="name" autoFocus value={this.state.name} onChange={this.handleInputChange}/>
					  </FormControl>
				   </Grid>


				  <Grid item xs={6} sm={3}>		  
					  <FormControl margin="normal" fullWidth>
						<InputLabel htmlFor="code">{t('Term code')}</InputLabel>
						<Input name="code" type="text" id="code" autoComplete="code" value={this.state.code} onChange={this.handleInputChange}/>
					  </FormControl>		  
				   </Grid>


				  <Grid item xs={6} sm={3}>		  
					  <Button
						type="submit"
						
						variant="contained"
						color="primary"
						className={classes.submit}
						startIcon={<SearchIcon/>}
					  >
					   { t('Search') }
					  </Button>
					</Grid>
					</Grid>	
				</Paper>		
			</form>
		
				 
				  <Table className={classes.table}>
					<TableHead>
					  <TableRow>
						<TableCell>{t('Term name')}</TableCell>
						<TableCell align="right">{t('Term code')}</TableCell>
						<TableCell align="right">{t('Parent term')}</TableCell>
						<TableCell align="right">{t('Weight')}</TableCell>
						<TableCell align="right">{t('Edit')}</TableCell>
						<TableCell align="right">{t('Delete')}</TableCell>
						<TableCell align="right">{t('Add child term')}</TableCell>
					  </TableRow>
					</TableHead>
					<TableBody>
					  {this.state.rows.map(row => (
						<TableRow key={row._id}>
						  <TableCell component="th" scope="row">
							{row.name}
						  </TableCell>
						  <TableCell align="right">{row.code}</TableCell>
						  <TableCell align="right">{row.parent && (row.parent.name || '')}</TableCell>
						  <TableCell align="right">{row.weight}</TableCell>
						  <TableCell align="right"><Link to={`/taxonomy/term/${row._id}/edit`}><EditIcon/></Link></TableCell>
						  <TableCell align="right"><Link to={`/taxonomy/term/${row._id}/delete`}><DeleteForeverIcon/></Link></TableCell>
						  <TableCell align="right"><Link to={`/taxonomy/term/add/${this.state.vid}?parent=${row._id}`}>{t('Add child term')}</Link></TableCell>
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
							inputProps: { 'aria-label':  t('Rows per page') },
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

export default withTranslation()(withStyles(styles)(VocabularyList));