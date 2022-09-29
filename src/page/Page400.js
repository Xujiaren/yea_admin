import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Page400 extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="clearfix" style={{marginTop:'20%'}}>
                <h1 className="float-left display-3 mr-4">400</h1>
                <h4 className="pt-3">无权限访问当前页面! </h4>
                <p className="text-muted float-left">请联系管理员！</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page400;
