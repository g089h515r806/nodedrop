import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import DefaultLayout from '../../layouts/DefaultLayout';


const styles = theme => ({
  root: {
    display: 'flex',
  },

  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    //height: '100vh',
    //overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing(2),
  },
});

class Dashboard extends React.Component {
  
  componentWillMount() {
	  this.props.history.replace('/content/article/list');
  }
  render() {
    const { classes, t } = this.props;

    return (
     <DefaultLayout title={this.props.title}>
		<main className={classes.content}>
		<div className={classes.appBarSpacer} />
        <div className={classes.root}>
          <Grid container justify="center"> 
           <p>{t('Welcome to Nodedrop')}</p>
          </Grid>
        </div>
		 </main>
      </DefaultLayout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default  withTranslation()(withStyles(styles)(Dashboard));
