import React,  { Component } from 'react';
import {Route,Redirect,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
//私有路由，只有登录且有权限的用户才能访问
class PrivateRoute extends Component{
    state = {
    }	
    checkPermission(){
		let { authority} = this.props;
		//console.log('authority',authority);
		let accountInfo = false;
		let accountInfoRaw = localStorage.getItem('accountInfo');
		//console.log(accountInfoRaw);
		//console.log(typeof(accountInfoRaw));
		if (typeof(accountInfoRaw) == 'string') {
		  accountInfo = JSON.parse(accountInfoRaw);
		}	  
        //console.log('accountInfo',accountInfo);
		let userRoles = accountInfo.roles || [];
        //userRoles = ['vipuser'];		
		// console.log('userRoles',userRoles);
		let sa = new Set(authority);
		let intersect = userRoles.filter(role => sa.has(role));
		//console.log('intersect',intersect);
        if(intersect.length > 0){
		  //this.setState({hasPermission:true})
		  return true;
		}else{
		  return false;
		}
    }	
    render(){
		//console.log('render');
        let { component: Component,path, noMatch: NoMatch, redirectTo,  exact=false,strict=false} = this.props;
		if(this.checkPermission()){
			return (<Route  path={path} exact={exact}  strict={strict}  render={(props)=>( <Component {...props} /> )} />)
		}else if(redirectTo){
			return (<Redirect to={{pathname: redirectTo,}}/>)
		}else if(NoMatch){
			return (<NoMatch />);
		}else{
			return (<div>您没有权限访问该页面</div>);
		}

    }
}
PrivateRoute.propTypes  ={
    path:PropTypes.string.isRequired,
	redirectTo:PropTypes.string,
	authority:PropTypes.array,
    exact:PropTypes.bool,
    strict:PropTypes.bool,
    component:PropTypes.func.isRequired,
	noMatch:PropTypes.object
}
export default withRouter(PrivateRoute);