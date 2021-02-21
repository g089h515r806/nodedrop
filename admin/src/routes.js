import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import NoMatch from './components/NoMatch'


import UserLogin from './pages/user/UserLogin'
import UserAdd from './pages/user/UserAdd'
import UserList from './pages/user/UserList'
import UserEdit from './pages/user/UserEdit'
import UserDelete from './pages/user/UserDelete'

import SystemInstall from './pages/system/SystemInstall'

import PageAdd from './pages/content/PageAdd'
import PageList from './pages/content/PageList'
import PageDelete from './pages/content/PageDelete'
import PageEdit from './pages/content/PageEdit'

import ArticleAdd from './pages/content/ArticleAdd'
import ArticleList from './pages/content/ArticleList'
import ArticleDelete from './pages/content/ArticleDelete'
import ArticleEdit from './pages/content/ArticleEdit'

import Dashboard from './pages/dashboard/Dashboard'

import VocabularyAdd from './pages/taxonomy/VocabularyAdd'
import VocabularyList from './pages/taxonomy/VocabularyList'
import VocabularyEdit from './pages/taxonomy/VocabularyEdit'
import VocabularyDelete from './pages/taxonomy/VocabularyDelete'
import TermAdd from './pages/taxonomy/TermAdd'
import TermList from './pages/taxonomy/TermList'
import TermDelete from './pages/taxonomy/TermDelete'
import TermEdit from './pages/taxonomy/TermEdit'


import RoleAdd from './pages/user/RoleAdd'
import RoleList from './pages/user/RoleList'
import RoleDelete from './pages/user/RoleDelete'
import RoleEdit from './pages/user/RoleEdit'
import RolePermission from './pages/user/RolePermission'


import LogList from './pages/dblog/LogList'


import ContactAdd from './pages/contact/ContactAdd'
import ContactList from './pages/contact/ContactList'
import ContactDelete from './pages/contact/ContactDelete'
import ContactEdit from './pages/contact/ContactEdit'


//const AUTENTICATED = ['administrator', 'authenticated'];
const ADMIN = ['administrator'];

export default props => (
    <HashRouter>

        <Switch>
		  
          <PrivateRoute exact path='/' component={ props => <Dashboard {...props} /> } authority={ADMIN}/>
		  <Route exact path='/user/login' component={ props => <UserLogin {...props} /> } />
		  <Route exact path='/system/install' component={ props => <SystemInstall {...props} /> } />
		  
		  <PrivateRoute exact path='/user/add' component={ props => <UserAdd {...props} /> } noMatch={NoMatch} authority={ADMIN}/> 
		  <PrivateRoute exact path='/user/list' component={ props => <UserList {...props} /> } noMatch={NoMatch} authority={ADMIN}/>
		  <PrivateRoute exact path='/user/:id/edit' component={ props => <UserEdit {...props} /> } noMatch={NoMatch} authority={ADMIN}/>	
		  <PrivateRoute exact path='/user/:id/delete' component={ props => <UserDelete {...props} /> } noMatch={NoMatch} authority={ADMIN}/>	  
	  

          <PrivateRoute exact path='/Dashboard' component={  props => <Dashboard {...props} /> }  authority={ADMIN}/>

		  <PrivateRoute exact path='/taxonomy/add' component={ props => <VocabularyAdd {...props} /> } noMatch={NoMatch} authority={ADMIN}/> 
		  <PrivateRoute exact path='/taxonomy/list' component={ props => <VocabularyList {...props} /> } noMatch={NoMatch} authority={ADMIN}/>
		  <PrivateRoute exact path='/taxonomy/:id/edit' component={ props => <VocabularyEdit {...props} /> } noMatch={NoMatch} authority={ADMIN}/>	
		  <PrivateRoute exact path='/taxonomy/:id/delete' component={ props => <VocabularyDelete {...props} /> } noMatch={NoMatch} authority={ADMIN}/>
          <PrivateRoute exact path='/taxonomy/term/list/:vid' component={ props => <TermList {...props} /> } noMatch={NoMatch} authority={ADMIN}/>
          <PrivateRoute exact path='/taxonomy/term/add/:vid' component={ props => <TermAdd {...props} /> } noMatch={NoMatch} authority={ADMIN}/>
		  <PrivateRoute exact path='/taxonomy/term/:id/delete' component={ props => <TermDelete {...props} /> } noMatch={NoMatch} authority={ADMIN}/>
		  <PrivateRoute exact path='/taxonomy/term/:id/edit' component={ props => <TermEdit {...props} /> } noMatch={NoMatch} authority={ADMIN}/>
		   	  
		  <PrivateRoute exact path='/user/role/add' component={ props => <RoleAdd {...props}/> } noMatch={NoMatch} authority={ADMIN}/> 
		  <PrivateRoute exact path='/user/role/list' component={ props => <RoleList {...props}/> } noMatch={NoMatch} authority={ADMIN}/>
		  <PrivateRoute exact path='/user/role/:id/edit' component={ props => <RoleEdit {...props}/> } noMatch={NoMatch} authority={ADMIN}/>
		  <PrivateRoute exact path='/user/role/:id/permission' component={ props => <RolePermission {...props}/> } noMatch={NoMatch} authority={ADMIN}/>		  
		  <PrivateRoute exact path='/user/role/:id/delete' component={ props => <RoleDelete {...props}/> } noMatch={NoMatch} authority={ADMIN}/>
		  
		  <PrivateRoute exact path='/content/page/add' component={ props => <PageAdd {...props}/> } noMatch={NoMatch} authority={ADMIN}/> 
		  <PrivateRoute exact path='/content/page/list' component={ props => <PageList {...props}/> } noMatch={NoMatch} authority={ADMIN}/>
		  <PrivateRoute exact path='/content/page/:id/edit' component={ props => <PageEdit {...props}/> } noMatch={NoMatch} authority={ADMIN}/>	
		  <PrivateRoute exact path='/content/page/:id/delete' component={ props => <PageDelete {...props}/> } noMatch={NoMatch} authority={ADMIN}/>
		  
		  <PrivateRoute exact path='/content/article/add' component={ props => <ArticleAdd {...props}/> } noMatch={NoMatch} authority={ADMIN}/> 
		  <PrivateRoute exact path='/content/article/list' component={ props => <ArticleList {...props}/> } noMatch={NoMatch} authority={ADMIN}/>
		  <PrivateRoute exact path='/content/article/:id/edit' component={ props => <ArticleEdit {...props}/> } noMatch={NoMatch} authority={ADMIN}/>	
		  <PrivateRoute exact path='/content/article/:id/delete' component={ props => <ArticleDelete {...props}/> } noMatch={NoMatch} authority={ADMIN}/>		  
		  
		  <PrivateRoute exact path='/contact/add' component={ props => <ContactAdd {...props}/> } noMatch={NoMatch} authority={ADMIN}/> 
		  <PrivateRoute exact path='/contact/list' component={ props => <ContactList {...props}/> } noMatch={NoMatch} authority={ADMIN}/>
		  <PrivateRoute exact path='/contact/:id/edit' component={ props => <ContactEdit {...props}/> } noMatch={NoMatch} authority={ADMIN}/>	
		  <PrivateRoute exact path='/contact/:id/delete' component={ props => <ContactDelete {...props}/> } noMatch={NoMatch} authority={ADMIN}/>		  

          <PrivateRoute exact path='/log/list' component={ props => <LogList {...props}/> } noMatch={NoMatch} authority={ADMIN}/>
			  
        </Switch>

    </HashRouter>
  )