import React from 'react';
import { Row, Col, Icon } from 'antd';

export class MoziServiceResult extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row type="flex" justify="center" style={{ textAlign: 'center' }}>
          <Col>
            <h2>
              <Icon
                type="check"
                style={{ color: '#28B846', fontSize: '56px' }}
              />
              <br />
              Anlaysis started!
            </h2>
            <p>Follow the link below to check the status of the analysis.</p>
            <a>{this.props.resultLink}</a>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
