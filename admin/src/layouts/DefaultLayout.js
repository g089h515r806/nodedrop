import React,  { Component} from 'react';
//import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
//import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AccountCircle from '@material-ui/icons/AccountCircle';

import NestedMenu from '../components/NestedMenu';


const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: 'flex',
  },	
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    //marginLeft: drawerWidth,
    //width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  account: {
    fontSize: '1rem',
  },
  accountCircle: {
    marginRight: 5,
  },
  logout: {
    textTransform: 'none',
  },  
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  }
})

class DefaultLayout extends Component {

  state = {
    open: true,
	accountInfo: {},
  };

  handleDrawerOpen = () => {
	let open = !this.state.open;
    this.setState({ open: open });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  logout = () => {
	 // console.log('1123');
    localStorage.removeItem("token");
    localStorage.removeItem("accountInfo");	
	this.props.history.push('/user/login');
    //this.setState({
	//  accountUserInfo:{}
    //});	  
    //this.setState({ open: false });
  };
  componentDidMount() {
	  this.checkLogin();
      document.title = this.props.title;
  };
  
  checkLogin() {
	let accountInfo = false;
    let accountInfoRaw = localStorage.getItem('accountInfo');
	console.log(accountInfoRaw);
    //console.log(typeof(accountInfoRaw));
    if (typeof(accountInfoRaw) == 'string') {
      accountInfo = JSON.parse(accountInfoRaw);
    }	  

	let uid = accountInfo.id || '';
	if(uid){
		var timestamp = Date.parse(new Date()) / 1000;
		console.log("timestamp", timestamp);
		var exp = accountInfo.exp || 0;
		//check expired
		if(exp > timestamp){
		  this.setState({accountInfo: accountInfo}, () => { 
		    //this.loadItems(0);
		  });
		}else{
			this.logout();
		}		
      
	}else{
		this.props.history.push('/user/login');
		//console.log(this.props);
	}

  }
  //componentWillMount() {
  //  this.checkLogin();
  //}	  
  render() {

    const { classes, t } = this.props;

    return (
	<div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={true} className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {t('Nodedrop CMS')}
            </Typography>

            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                className={classes.account}
                color="inherit"
              >
                <AccountCircle className={classes.accountCircle}/>
				{this.state.accountInfo.name|| ""}
              </IconButton>
			  
              <Button color="inherit" className={classes.logout} onClick={this.logout.bind(this)}>
                {t('Logout')}
              </Button>
            </div>			
			
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
		  
		  <NestedMenu/>
		   

          <Divider />
         
        </Drawer>
		
		 {this.props.children}
		</div>
    )
  }
}

export default  withRouter(withTranslation()(withStyles(styles)(DefaultLayout)))
