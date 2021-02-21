import React,  { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import BuildIcon from '@material-ui/icons/Build';
import ToysIcon from '@material-ui/icons/Toys';
import StorageIcon from '@material-ui/icons/Storage';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FeedbackIcon from '@material-ui/icons/Feedback';
import FilterNoneIcon from '@material-ui/icons/FilterNone';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  active: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },  
})


class NestedMenu extends Component {
  state = {
	contentOpen: true,
	userOpen: false,
	systemOpen: false,
  }

   constructor(props) {
    super(props);

	  let defaultContentOpen = sessionStorage.getItem("contentOpen");

	  if(defaultContentOpen ==='true' || defaultContentOpen ===undefined){
		defaultContentOpen = true;  
	  }else{
		defaultContentOpen = false;   
	  }
	  let defaultUserOpen = sessionStorage.getItem("userOpen");
	  if(defaultUserOpen ==='true' || defaultUserOpen ===undefined){
		defaultUserOpen = true;  
		
	  }else{
		defaultUserOpen = false;   
	  }
	  let defaultSystemOpen = sessionStorage.getItem("systemOpen");
	  if(defaultSystemOpen ==='true' || defaultSystemOpen ===undefined){
		defaultSystemOpen = true;  
		
	  }else{
		defaultSystemOpen = false;   
	  }	  
	  //console.log('defaultReportOpen2',defaultReportOpen);
      this.state =	{
          contentOpen:defaultContentOpen,
          userOpen:defaultUserOpen,	
          systemOpen:defaultSystemOpen,		  
		};  
    	/*this.setState({
          contentOpen:defaultContentOpen,
          userOpen:defaultUserOpen,	
          systemOpen:defaultSystemOpen,		  
		});  */
  }   
  componentDidMount() {

    //this.checkLogin();
  }	  


  handleUserClick = () => {
	sessionStorage.setItem("userOpen", !this.state.userOpen);    
	this.setState({
	  userOpen:!this.state.userOpen,
	});	  

  };
 
  handleContentClick = () => {
	sessionStorage.setItem("contentOpen", !this.state.contentOpen);  
	this.setState({
	  contentOpen:!this.state.contentOpen,
	});	
    	
  };
  handleSystemClick = () => {
	sessionStorage.setItem("systemOpen", !this.state.systemOpen);  
	this.setState({
	  systemOpen:!this.state.systemOpen,
	});
    		
  }; 
  render() {  
	 const { classes, t } = this.props;
	 const {pathname} = this.props.location;
	 //console.log('location', this.props.location);
  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
         
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem button onClick={this.handleContentClick.bind(this)}>
        <ListItemIcon>
          <FilterNoneIcon />
        </ListItemIcon>
        <ListItemText primary={t('Content')} />
		{this.state.contentOpen===true ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
	  
      <Collapse in={this.state.contentOpen===true} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={`${classes.nested}`} component={Link} selected={pathname ==='/content/page/list'} to={{pathname: '/content/page/list'}}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary={t('Pages')} />
          </ListItem>
          <ListItem button className={`${classes.nested}`} component={Link} selected={pathname ==='/content/article/list'} to={{pathname: '/content/article/list'}}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary={t('Articles')} />
          </ListItem>
		  
        </List>
      </Collapse>	  

  
      <ListItem button onClick={this.handleUserClick.bind(this)}>
        <ListItemIcon>
          <PeopleOutlineIcon />
        </ListItemIcon>
        <ListItemText primary={t('User')} />
        {this.state.userOpen===true ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={this.state.userOpen===true} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={`${classes.nested}`} component={Link} selected={pathname ==='/user/list'} to={{pathname: '/user/list'}}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={t('Users')} />
          </ListItem>
          <ListItem button className={classes.nested} component={Link} selected={pathname ==='/user/role/list'} to={{pathname: '/user/role/list'}}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary={t('Roles')} />
          </ListItem>
		  
        </List>
      </Collapse>
      <ListItem button onClick={this.handleSystemClick.bind(this)}>
        <ListItemIcon>
          <BuildIcon />
        </ListItemIcon>
        <ListItemText primary={t('System')} />
        {this.state.systemOpen===true ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={this.state.systemOpen===true} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={`${classes.nested}`} component={Link} selected={pathname ==='/taxonomy/list'} to={{pathname: '/taxonomy/list'}}>
            <ListItemIcon>
              <ToysIcon />
            </ListItemIcon>
            <ListItemText primary={t('Taxonomy')} />
          </ListItem>
		  
          <ListItem button className={classes.nested} component={Link} selected={pathname ==='/log/list'} to={{pathname: '/log/list'}}>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary={t('Logs')} />
          </ListItem>
          <ListItem button className={classes.nested} component={Link} selected={pathname ==='/contact/list'} to={{pathname: '/contact/list'}}>
            <ListItemIcon>
              <FeedbackIcon />
            </ListItemIcon>
            <ListItemText primary={t('Contacts')} />
          </ListItem>	

		  
        </List>
      </Collapse>	  
    </List>
  );
  }
}
export default withRouter(withTranslation()(withStyles(styles)(NestedMenu)))

