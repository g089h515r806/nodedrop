import React,  { Component } from 'react';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
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
    height: '100vh',
    overflow: 'auto',
  },
  button: {
    backgroundColor: theme.palette.primary['A100']
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1)
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 42
  },
  formControl: {
    width: '100%'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },    
  grid: {
    width: 1000
  }
})

class VocabularyEdit extends Component {
  state = {
	id:'',
    name: '',
    code: ''
  }
  
  constructor(props) {
    super(props);
    this.state = {
	  id:'',
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


	const  dataURL =  config.baseUrl +'/taxonomy/' + this.state.id;
	var token = localStorage.getItem('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	console.log('token', token);
	var that = this;
	axios.put(dataURL, {
		id: this.state.id,
		name: this.state.name,
		code: this.state.code
	  })
	  .then(function (response) {
		console.log(response);
		that.props.history.replace('/taxonomy/list');
	  })
	  .catch(function (error) {
		console.log(error);
	  });
    //history.replace('/user/list'); 

    event.preventDefault();
  }  
  componentDidMount() {
    this.setTitle();
	//var that = this;

	const { id } = this.props.match.params;

	const  dataURL = config.baseUrl +'/taxonomy/' + id;
	var token = localStorage.getItem('token') || "";
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;	 	
    axios.get(dataURL)
      .then(result => {
		console.log(result.data);  

		this.setState({
		  id: result.data._id,
		  name: result.data.name,
		  code: result.data.code
		});
	})
    .catch(error => {
		  console.log(error); 
	});		  
  }
  
  setTitle() {
	const { t } = this.props;
	document.title = t('Edit vocabulary');	  
  }
  
  render() {
    const { classes, t } = this.props;
    //const currentPath = this.props.location.pathname

    return (
      <DefaultLayout title={this.props.title}>
		<main className={classes.content}>	
		<div className={classes.appBarSpacer} />
        <div className={classes.root}>
          <Grid container justify="center"> 
            <Grid spacing={3} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
				<form className={classes.form} onSubmit={this.handleSubmit}>

				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="name">{t('Vocabulary name')}</InputLabel>
					<Input name="name" type="text" id="name" autoComplete="name" value={this.state.name} onChange={this.handleInputChange}/>
				  </FormControl>
				  <FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="code">{t('Vocabulary code')}</InputLabel>
					<Input name="code" type="text" id="code" autoComplete="code" value={this.state.code} onChange={this.handleInputChange}/>
				  </FormControl>		  
				  <Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
				  >
				   {t('Save')}
				  </Button>
				</form>

              </Grid>
            </Grid>
          </Grid>
        </div>
		 </main>
       </DefaultLayout>
    )
  }
}

export default withRouter(withTranslation()(withStyles(styles)(VocabularyEdit)))