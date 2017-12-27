

import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import HeaderLinks from './HeaderLinks';
//<Navbar.Toggle onClick={this.mobileSidebarToggle}/>
class Header extends Component{
    constructor(props){
        super(props);
        this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
        this.state = {
            sidebarExists: false
        };
    }
    mobileSidebarToggle(e){
        if(this.state.sidebarExists === false){
            this.setState({
                sidebarExists : true
            });
        }
        e.preventDefault();
        document.documentElement.classList.toggle('nav-open');
        var node = document.createElement('div');
        node.id = 'bodyClick';
        node.onclick = function(){
            this.parentElement.removeChild(this);
            document.documentElement.classList.toggle('nav-open');
        };
        document.body.appendChild(node);
    }
    getBrand(){
        var name;
        name = "BLG Mining";
        return name;
    }
    render(){
        return (
            <Navbar fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#pablo">{this.getBrand()}</a>
                    </Navbar.Brand>

                </Navbar.Header>
                <Navbar.Collapse>
                    <HeaderLinks />
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header
