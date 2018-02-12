/**
 * Created by Vivek on 08-02-2018.
 */

import React, { Component } from 'react';
import moment from 'moment';
import {Form, FormGroup, Col,Row ,ControlLabel, Button, ButtonToolbar, Modal, Panel, Tabs, Tab, Label} from 'react-bootstrap';
import css from '../filter.css';
import CriteriaComponent from './criteria-component'

class FilterComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addCriteria : false,
            criteriaList: [],
            filterFileds : [
                { colunmId : 0 , colunmName : "sensor" , value : "", type : "string" , operators : [{name:"equal", value : "contain"}, {name:"Start with", value : "start with"} , {name:"End With", value : "End With"}] },
                { colunmId : 1 , colunmName : "category" , value : "", type : "option" , operators : [{name:"equal", value : "contain"}, {name:"Not equal", value : "Not contain"} ] },
                { colunmId : 2 , colunmName : "source" , value : "[source.country.isocode]", type : "option" , operators : [{name:"equal", value : "contain"}, {name:"Not equal", value : "Not contain"} ] }
            ]
        }
    }

    addCriteriaToList(criteria ={colunmId : 0 , colunmName : "" , value : "", type : "string" , operators : [{name:"equal", value : "contain"}]} ,filter ={}){
        this.state.criteriaList.push({id : this.state.criteriaList.length, criteria : criteria , filter :filter});
        this.setState({addCriteria : true});
        this.state.addCriteria = false;
    }

    onAddCriteria (){
        if(this.state.filterFileds.length > this.state.criteriaList.length){
            this.addCriteriaToList({ colunmId : 0 , colunmName : "" , value : "", type : "" , operator : {name:"equal", value : "="}} )
        }else{
            alert("Sorry, You can not add more filter criteria")
        }
    }

    renderCriteriaComponent (){
        return (
            <ul>
                {this.state.criteriaList.map((item, index) => (
                    <CriteriaComponent key={`criteria-${index}`} index={index} id={item.id}  criteria ={item.criteria}  filterFileds = {this.state.filterFileds} updateOrAddCriteria ={this.updateOrAddCriteria.bind(this)} />
                ))}
            </ul>
        );

    }

    onSearch (){
        if(this.state.criteriaList.length === 0){
            alert("Select Criteria First");
        }
        console.log("this.state.criteriaList >>> ",this.state.criteriaList)
        this.props.onSearch(this.state.criteriaList)
    }
    onCancel (){
        this.setState({addCriteria : false});
    }

    updateOrAddCriteria (id = 0,criteria ,filter ){
        if(id => 0){
            this.state.criteriaList.find((i)=>i.id === id ).criteria =criteria

        }
    }


    render(){
        return (
            <Col md={12} className="filteringOperation">
                <Col md={10}>
                    <Col md={12}  className="filterCol">
                        {this.renderCriteriaComponent()}
                    </Col>
                    <Col md={12} className="filterCriteria">
                        <Col md={4}> </Col>
                        <Col md={3} >
                            <Button className="criteriaButton" onClick={this.onAddCriteria.bind(this)}> + ADD CRITERIA </Button>
                        </Col>
                        <Col md={4}> </Col>
                    </Col>
                </Col>

                <Col md={2}>
                    <Col md={12}>
                    <Button className="searchFilterButton" onClick={this.onSearch.bind(this)}> Search </Button>
                    </Col>
                    {/*<Col md={12} hidden={!this.state.addCriteria}>*/}
                    {/*<Button className="searchFilterButton" onClick={this.onCancel.bind(this)}> Cancel </Button>*/}
                    {/*</Col>*/}
                </Col>
            </Col>
        )
    }
}

export default FilterComponent;