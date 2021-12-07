import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import RaisedButton from 'material-ui/RaisedButton'

function Success() {    
    return (
            <div>
                <AppBar title= "Booked!"></AppBar>
                <br/>
                <h3>Your Appointment was booked successfully!</h3>
            </div>
    )
}

export default Success
