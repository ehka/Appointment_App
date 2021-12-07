import React, {useEffect} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import {avail_url} from "../constants/urls"


function ServiceInfoForm({...props}) {



    const continueToNext = e => {
        e.preventDefault()
        axios.get(avail_url, {params:{
            location: serviceInfo.location,
            day: serviceInfo.date,
            service: serviceInfo.name,
        }}).then(response =>
            props.handleChangeAvailabilities(response.data)
            )
        props.nextStep()
    }
    const goToPrevious = e => {
        e.preventDefault()
        props.prevStep()
    }   
    const {serviceAndLocation, serviceInfo, handleChangeService} = props
    const services = serviceAndLocation["serviceInfo"]
    const locations = serviceAndLocation["locationInfo"]
    console.log(locations)
    
    return (
            <div>
                <AppBar title= "Enter Service Information"></AppBar>
                <br/>
                <FormControl className={useStyles().formControl}>
                    <Select
                        autoWidth
                        labelId="Location"
                        id="Location"
                        value={serviceInfo.location}
                        onChange={handleChangeService('location')}
                        >
                        {locations.map((loc) =>
                        <MenuItem key={loc.name} value={loc.name}>{loc.name}</MenuItem>
                        )}
                    </Select>
                    <FormHelperText>Choose Location</FormHelperText>
                </FormControl>
                <br/>
                <FormControl className={useStyles().formControl}>
                    <Select
                        autoWidth
                        labelId="name"
                        id="name"
                        value={serviceInfo.name}
                        onChange={handleChangeService('name')}
                        >
                        {services.map((service) =>
                        <MenuItem key={service.name} value={service.name}>{service.name}</MenuItem>
                        )}
                    </Select>
                    <FormHelperText>Choose Service</FormHelperText>
                </FormControl>
                <br/>
                <FormControl className={useStyles().formControl}>
                    <TextField
                        id="date"
                        type="date"
                        defaultValue={serviceInfo.date}
                        onChange={handleChangeService('date')}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                <FormHelperText>Choose Date</FormHelperText>
                </FormControl>
                <br/>
                <RaisedButton
                    label="Back"
                    style={styles.button}
                    onClick={goToPrevious}
                /> 
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
    },
}
const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  export default ServiceInfoForm
