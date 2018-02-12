/**
 * Created by Vivek on 08-02-2018.
 */

import React, { Component } from 'react';
import moment from 'moment';
import {Form, FormGroup, Col,Row ,ControlLabel, Button, ButtonToolbar, Modal, Panel, Tabs, Tab, Label} from 'react-bootstrap';
import css from '../filter.css';

class CriteriaComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operatorsReload : false
        };

        this.operators = [];
        this.categoryValues = [{name:"ssh"} , {name:"connect"}];
        this.sourceValues = [{name:"IE"} , {name:"US"},{name:"CN"} , {name:"VN"},{name:"IT"}];
        this.selectedOperatorType = "string";
        this.selectedOperator = null;
        this.selectedColumn = null;
    }

    initDefaultValue (){
        this.state.operatorsReload = false;
    }

    onColumnChange (event) {
        if(event.target.selectedIndex > 0 ){
            const selectedOption = event.target.selectedOptions[0];
            const  filterFileds = this.props.filterFileds;
            filterFileds.map((item, index) => {
                if(item.colunmName === selectedOption.value){
                    this.operators = item.operators;
                    this.selectedOperatorType = item.type;
                    this.selectedColumn = item;
                }
            });
            this.setState({operatorsReload : true});
            this.initDefaultValue();

        }else{
            this.operators = [];
        }
    }

    onOperatorsChange (event) {
        if(event.target.selectedIndex > 0 ){
            const selectedOption = event.target.selectedOptions[0];
            this.selectedColumn.operators.map((item, index) => {
                if(item.value === selectedOption.value){
                    this.selectedOperator = item;
                }
            });
            this.setState({operatorsReload : true});
            this.initDefaultValue();
        }else{
            this.operators = [];
        }
    }


    onValueChange (event){
        // 1> build Criteria object
        const value = event.target.selectedOptions ? event.target.selectedOptions[0].value : event.target.value;
        const criteria = {
            colunmId: this.selectedColumn.colunmId,
            colunmName: this.selectedColumn.colunmName,
            value:value,
            type: this.selectedColumn.type,
            operator: this.selectedOperator
        };

        this.props.updateOrAddCriteria(this.props.id,criteria)
    }


    renderColumn() {
        const  filterFileds = this.props.filterFileds;
        return (
            <select id="details" className="filter_details" onChange={this.onColumnChange.bind(this)}>
                <option value=""> </option>
                {filterFileds.map((item, index) => (
                    <option key={`filterFileds-${index}`} value={item.colunmName} className="filter_option_color"> {item.colunmName} </option>
                ))}
            </select>
        )
    }


    renderOperators() {
        return (
            <select id="options" className="filter_options" onChange={this.onOperatorsChange.bind(this)}>
                <option value=""> </option>
                {this.operators.map((item, index) => (
                    <option key={`items-${index}`} value={item.value} className="filter_option_color"> {item.name} </option>
                ))}
            </select>
        )
    }

    renderCriteriaValue(){
        if(this.selectedOperatorType ==="option"){
            if(this.selectedColumn.colunmName === "category"){
                return this.renderCriteriaValueTypeOptionForCategory(this.categoryValues);
            }else {
                return this.renderCriteriaValueTypeOptionForCategory(this.sourceValues);
            }
        }else{
            return this.renderCriteriaValueTypeString();
        }

    }

    renderCriteriaValueTypeString(){
        return (
            <input type="text" className="filter_keywords" onChange = {this.onValueChange.bind(this)}/>
        )
    }

    renderCriteriaValueTypeOptionForCategory(value){
        return (
            <select id="options" className="filter_options" onChange = {this.onValueChange.bind(this)} >
                {value.map((item, index) => (
                    <option key={`filterFileds-${index}`} value={item.name} className="filter_option_color"> {item.name} </option>
                ))}
            </select>
        )
    }

    render(){
        return(
            <Col md={12} className="inputFilter" >
                <Col md={4}>
                    {this.renderColumn()}
                </Col>
                <Col md={4}>
                    {this.renderOperators()}
                </Col>
                <Col md={4}>
                    {this.renderCriteriaValue()}
                </Col>
            </Col>
        )
    }
}

export default CriteriaComponent;