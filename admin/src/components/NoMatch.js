import React,  { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import DefaultLayout from '../layouts/DefaultLayout';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.palette.grey['A500'],
    overflow: 'hidden',

    marginTop: 20,
    padding: 20,
    paddingBottom: 200	
  },
  appBarSpacer: theme.mixins.toolbar,  
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    //height: '100vh',
    //overflow: 'auto',
  }, 
})
class NoMatch extends Component {
  
  render() {
    const { classes } = this.props;
    //const { classes } = this.props;

    return (
      <DefaultLayout title={this.props.title}>
		<main className={classes.content}>	
		<div className={classes.appBarSpacer} />
        <div className={classes.root}>	
          <Grid container justify="center"> 
            <Grid spacing={10} alignItems="center" justify="center" container className={classes.grid}>		
				<div>
				 <p>您没有权限查看本页面。</p>
				</div>
            </Grid>
          </Grid>
        </div>
		 </main>
       </DefaultLayout>			
    )
  }
}
export default withStyles(styles)(NoMatch)

