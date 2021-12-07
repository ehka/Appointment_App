import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'


function ClientInfoForm({...props}) {

    const continueToNext = e => {
        e.preventDefault()
        props.nextStep()
    }
    const {clientInfo, handleChangeClient} = props
    
    return (

            <div>
                <AppBar title= "Enter User Info"></AppBar>
                <TextField
                    hintText = "Enter your First Name"
                    floatingLabelText = "First Name"
                    onChange={handleChangeClient('first_name')}
                    defaultValue={clientInfo.first_name}
                />
                <br/>
                <TextField
                    hintText = "Enter your Last Name"
                    floatingLabelText = "Last Name"
                    onChange={handleChangeClient('last_name')}
                    defaultValue={clientInfo.last_name}
                />
                <br/>
                <TextField
                    hintText = "Enter your Email Address"
                    floatingLabelText = "Email"
                    onChange={handleChangeClient('email')}
                    defaultValue={clientInfo.email}
                /> 
                <br/>
                <TextField
                    hintText = "Enter your Phone Number"
                    floatingLabelText = "Phone Number"
                    onChange={handleChangeClient('phone_number')}
                    defaultValue={clientInfo.phone_number}
                />
                <br/>
                <RaisedButton
                    label="Continue"
                    primary={true}
                    style={styles.button}
                    onClick={continueToNext}
                />               
            </div>
    )
}

const styles = {
    button: {
        margin: 15
    }
}
export default ClientInfoForm
