import React,  { Component } from 'react';
//import { Promise } from 'es6-promise';
//import fetch from 'isomorphic-fetch';
//import fetch from 'isomorphic-fetch';
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
import SecurityIcon from '@material-ui/icons/Security';
import Button from '@material-ui/core/Button';

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
    padding: theme.spacing(3),
    //height: '100vh',
    overflow: 'auto',
  }
})



class RoleList extends Component {
  state = {
    rows: []
  }	
  
  componentDidMount() {
	   this.setTitle();

  //const  dataURL = 'http://localhost:3001/api/user';
  const  dataURL = config.baseUrl + '/user/role';
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	  
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
	document.title = t('Roles');	  
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
			component={Link} to="/user/role/add"
          >
           {t('Add role')}
          </Button>

				      <Table className={classes.table}>
						<TableHead>
						  <TableRow>
							<TableCell>{t('Role ID')}</TableCell>
							<TableCell align="center">{t('Role name')}</TableCell>
							<TableCell align="center">{t('Edit')}</TableCell>
							<TableCell align="center">{t('Permission')}</TableCell>
							
							<TableCell align="center">{t('Delete')}</TableCell>
						  </TableRow>
						</TableHead>
						<TableBody>
						  {this.state.rows.map(row => (
							<TableRow key={row._id}>
							  <TableCell component="th" scope="row">
								{row.rid}
							  </TableCell>
							  <TableCell align="center">{t(row.name)}</TableCell>
							  <TableCell align="center"><Link to={`/user/role/${row._id}/edit`}><EditIcon/></Link></TableCell>
							  <TableCell align="center"><Link to={`/user/role/${row._id}/permission`}><SecurityIcon/></Link></TableCell>
							  <TableCell align="center"><Link to={`/user/role/${row._id}/delete`}><DeleteForeverIcon/></Link></TableCell>
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

export default withTranslation()(withStyles(styles)(RoleList));