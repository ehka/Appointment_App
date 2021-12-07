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
import axios from 'axios'
import {reserve_url} from '../constants/urls'


function AvailabilityDetails({...props}) {

    const continueToNext = (slot, employee_id) => e => {
        e.preventDefault()
        handleReservation(slot, employee_id)
        props.nextStep()
    }
    const goToPrevious = e => {
        e.preventDefault()
        props.prevStep()
    }

    const handleReservation = (slot, employee_id) => {
        const start_time = slot[0]
        const end_time = slot[1]
        const clientInfo = props.clientInfo
        const serviceInfo = props.serviceInfo
        axios({
            method: 'post',
            url: reserve_url,
            data: {
                client: {
                    first_name: clientInfo.first_name,
                    last_name: clientInfo.last_name,
                    phone_number: clientInfo.phone_number,
                    email: clientInfo.email,
                },
                service: {
                    name: serviceInfo.name,
                    location: serviceInfo.location,
                    date: serviceInfo.date,
                },
                reservation: {
                    start_time: start_time,
                    end_time: end_time,
                    employee_id: employee_id,
                }
            }
          });
    }
    const {avails} = props
    const showAvails = () => {
        for (const key in avails.openTimes) {
            const employeeName = avails.employeeInfo[key].name
            console.log(employeeName)
            const times = avails.openTimes[key]
            return (
                <div className={style().button}>
                    <br/>
                    <h4>{employeeName}</h4>
                    {
                        times.map(slot => 
                            <Button key={slot} onClick={continueToNext(slot, key)} size="small" variant="contained" color="primary">
                                {slot[0] + " - " + slot[1]}
                                </Button>
                        )}
                </div>
            )
            
        }

    }
    
    return (
            <div>
                <AppBar title= "Availability List"></AppBar>
                    {showAvails()}
                    <RaisedButton
                        label="Back"
                        style={styles.button}
                        onClick={goToPrevious}
                    /> 
            </div>
    )
}

const styles = {
    button: {
        margin: 15
    }
}
const style = makeStyles((theme) => ({
    button: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

export default AvailabilityDetails
