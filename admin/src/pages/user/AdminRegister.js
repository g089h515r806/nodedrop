import React,  { Component } from 'react';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
//import history from 'history';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import config from '../../config/config';


const backgroundShape = require('../../images/shape.svg');


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary['A100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    marginTop: 10,
    padding: 20,
    paddingBottom: 500
  },
  smallContainer: {
    width: '60%'
  },
  bigContainer: {
    width: '80%'
  },
  logo: {
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
	textAlign: 'center',
  },  
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },  
  formControl: {
    width: '100%'
  },
  form: {
    //width: '100%', // Fix IE 11 issue.
	maxWidth:480,
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  }
})

class AdminRegister extends Component {

  state = {
    email: '',
    name: '',
	password: ''
  }
  
  constructor(props) {
    super(props);

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


	//const  dataURL = 'http://localhost:3001/api/user';
	const  dataURL = config.baseUrl + '/user/admin/register';
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	
	var that = this;
	axios.post(dataURL, {
		name: this.state.name,
		email: this.state.email,
		password: this.state.password,
	  })
	  .then(function (response) {
		console.log(response);
		var errors = response.data.error || '';
		if(errors !== ''){
			alert('错误消息：' + errors);
		}else{
		  that.props.history.replace('/user/login');
		}
	  })
	  .catch(function (error) {
		console.log(error);
	  });
    //history.replace('/user/list'); 

    event.preventDefault();
  }  
  componentDidMount() {

  }

static defaultProps = {
        title:"添加用户"
}  

  render() {

    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>

          <Grid container justify="center">
            <Grid spacing={10} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Nodedrop管理初始设置
            </Typography>
                <div className={classes.formContainer}>

        <form className={classes.form} onSubmit={this.handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">电子邮件</InputLabel>
            <Input id="email" name="email" autoComplete="email" autoFocus value={this.state.email} onChange={this.handleInputChange}/>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">用户名</InputLabel>
            <Input name="name" type="text" id="name" autoComplete="name" value={this.state.name} onChange={this.handleInputChange}/>
          </FormControl>

		 <FormControl margin="normal" required fullWidth>
		    <InputLabel htmlFor="password">密码</InputLabel>
			<Input  name='password' type='password' value={this.state.password} onChange={this.handleInputChange} />	
		 </FormControl>			  
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
           添加管理员
          </Button>
        </form>

                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(AdminRegister))
