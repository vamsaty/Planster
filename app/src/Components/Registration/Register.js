import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import Button from '../UI/Button/Button';
import Spinner from '../UI/Spinner/Spinner';
import classes from './Register.module.css';
import axios from 'axios';
import Input from '../UI/Input/Input';

class ContactData extends Component {
    state = {
        redirect : false,
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Username'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            phone: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Ph No'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            city: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'City'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
           
            address: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Address'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            age: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Age'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            
            
        },
        formIsValid: false,
        loading: false
    }
    
    componentWillMount(){
        if(sessionStorage.getItem("userData")){
            console.log("User is in");
            this.setState({redirect : true})
        }else{
            this.setState({redirect : false})
        }
    }

    orderHandler = ( event ) => {
        event.preventDefault();
        this.setState( { loading: true } );
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            name : this.state.orderForm.name.value,
            username : this.state.orderForm.username.value,
            password : this.state.orderForm.password.value,
            address : this.state.orderForm.address.value,
            city : this.state.orderForm.city.value,
            email : this.state.orderForm.email.value,
            phone : this.state.orderForm.phone.value,
            age : this.state.orderForm.age.value
        }

        axios.post('http://localhost:5000/api/v1/register', order )
            .then( response => {
                this.setState( { loading: false } );
                this.props.history.push( '/' );
                
            } )
            .catch( error => {
                this.setState( { loading: false } );
            } );
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = { 
            ...updatedOrderForm[inputIdentifier]
        };
        
        updatedFormElement.value = event.target.value;

        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render () {

        if(this.state.redirect){
            return (<Redirect to={'/'} />);
        }

        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>Sign Up!</Button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />;
        }
        return (
            <div className={classes.RegisterData}>
                <h4>
                    Just one step to go..!!
                </h4>
                {form}
            </div>
        );
    }
}

export default ContactData;