import React from 'react';
import { CheckCircle } from '@material-ui/icons';
import { Grid, Card, CardContent } from '@material-ui/core';

export class MoziServiceResult extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Grid container justify={'center'}>
          <Grid
            xs={12}
            sm={8}
            md={4}
            item
            style={{ textAlign: 'center', paddingTop: '10%' }}
          >
            <Card
              style={{
                backgroundColor: '#deffde'
              }}
            >
              <CardContent>
                <h2>
                  <CheckCircle style={{ fontSize: '48px', color: '#54C21F' }} />
                  <br />
                  Anlaysis started!
                </h2>
                <p>
                  Follow the link below to check the status of the analysis.
                </p>
                <p
                  style={{
                    marginTop: '15px',
                    backgroundColor: '#fff',
                    border: '5px',
                    padding: '10px',
                    borderRadius: '5px'
                  }}
                >
                  <a href={this.props.resultLink}>{this.props.resultLink}</a>
                </p>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
