import React, { Component } from 'react';
import moment from 'moment';

import {Form, FormGroup, Col,Row ,ControlLabel, Button, ButtonToolbar, Modal, Panel, Tabs, Tab, Label} from 'react-bootstrap';

import { connect } from 'react-redux';

import Header from './header';
import SessionList from './session-list';
import FilterComponent from './filter-component'
import View from './view';
import Flag from "react-flags";

class Events extends Component {
    constructor(props) {
        super(props);
        this.criteriaList = []
        this.state ={
            isSearch : false
        }
    }

    componentWillMount() {
        const { dispatch } = this.props;

    }



    checkValueByOperateor (type , operator ,currentValue, value){
        let result = false;
       if(type==="string"){
            result = this.checkValueByOperateorForString(operator ,currentValue, value)
       }else if(type ==="option"){
           result = this.checkValueByOperateorForOption(operator ,currentValue, value)

       }

       return result;
    }

    isValidRow (row){
        let result = true;
        this.criteriaList.map((item)=>{
            debugger;
            let currentValue;
            if(item.criteria.colunmName === "source"){
                 currentValue  =row["source.country.isocode"] ||"";
            }else {
                 currentValue  =row[item.criteria.colunmName] ||"";
            }
            if(!this.checkValueByOperateor(item.criteria.type, item.criteria.operator.value ,currentValue  ,item.criteria.value)){
                result = false;
            }
        });

        return result;
    }

    checkValueByOperateorForString (operator ,currentValue, value){
        let result = false;
        if(operator ==="contain"){
            result = currentValue.includes(value)
        }else if(operator ==="Start With"){
            result = currentValue.startsWith(value)
        }else if(operator ==="End With"){
            result = currentValue.endsWith(value)
        }else{
            result = false;
        }
        return result;
    }

    checkValueByOperateorForOption (operator ,currentValue, value){
        let result = false;
        if(operator ==="contain"){
            result = currentValue.includes(value)
        }else if(operator ==="Not contain"){
            result = !(currentValue.includes(value))
        }else{
            result = false;
        }
        return result;
    }

    onSearch(criteriaList){
        this.criteriaList = criteriaList ||[];
        this.setState({})
    }


    renderTable(self) {
        if(!this.props.events) {
            return (
                <div>Loading...</div>
            );
        }
        const { events } = this.props;

        return events.sort(function (left, right) {
           return moment(right.date).utc().diff(moment(left.date).utc());
        }).slice(0, 10).map((event, i) => {
            let message = (event.message || event.payload );

            if (event.category === 'ssh') {
                message = event['ssh.request-type'];
            }

            if (!this.isValidRow(event)) {
               return ;
            }
            return (
                <tr key={i}>
                    <td>{event.date.fromNow() }</td>
                    <td>{event.sensor}</td>
                    <td>{event.category}</td>
                    <td><Flag name={event['source.country.isocode']}
                              basePath="images/flags"
                              format="png"
                              pngSize={16}
                              shiny={false}/>
                        {event["source-ip"] } ({event["source-port"] })</td>
                    <td>{event["destination-ip"] } ({event["destination-port"] })</td>
                    <td>{message}</td>
                </tr>
            );
        });
    }



    render() {
        const events = this.renderTable(this);
        return (
            <View title="Overview" subtitle="Events">
                <FilterComponent onSearch={this.onSearch.bind(this)}/>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="header">Date</th>
                            <th className="header">Sensor</th>
                            <th className="header">Category</th>
                            <th className="header">Source</th>
                            <th className="header">Destination</th>
                            <th className="header">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        { events }
                    </tbody>
                </table>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        events: state.sessions.events
    };
}

export default connect(mapStateToProps)(Events);
