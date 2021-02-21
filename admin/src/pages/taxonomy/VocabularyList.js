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
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
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
  }
})

class VocabularyList extends Component {
  state = {
    rows: []
  }
 
  componentDidMount() {
    this.setTitle();
	
    const  dataURL = config.baseUrl + '/taxonomy';
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 	
	//const  dataURL = 'http://localhost:3001/api/taxonomy';
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

  }
  setTitle() {
	const { t } = this.props;
	document.title = t('Taxonomy');	  
  }  
 

  render() {
    const { classes, t } = this.props;
    //const currentPath = this.props.location.pathname;
	
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
			component={Link} to="/taxonomy/add"
          >
           {t('Add vocabulary')}
          </Button>
				 
				      <Table className={classes.table}>
						<TableHead>
						  <TableRow>
							<TableCell>{t('Vocabulary name')}</TableCell>
							<TableCell align="right">{t('Vocabulary code')}</TableCell>
							<TableCell align="right">{t('Term list')}</TableCell>
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
							  <TableCell align="right">{row.code}</TableCell>
							  <TableCell align="right"><Link to={`/taxonomy/term/list/${row._id}`}>{t('Term list')}</Link></TableCell>
							  <TableCell align="right"><Link to={`/taxonomy/${row._id}/edit`}><EditIcon/></Link></TableCell>
							  <TableCell align="right"><Link to={`/taxonomy/${row._id}/delete`}><DeleteForeverIcon/></Link></TableCell>
							</TableRow>
						  ))}
						</TableBody>
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