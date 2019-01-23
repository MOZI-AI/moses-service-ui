import React from 'react';
import { Check } from '@material-ui/icons';
import { Grid, Card, CardContent } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';

const SuccessCardContent = withStyles({
  root: { borderTop: `solid 3px ${green[600]}` },
  message: { color: '#fff' }
})(CardContent);

export class MoziServiceResult extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Grid container>
          <Grid xs={4} />
          <Grid xs={4} item style={{ textAlign: 'center', paddingTop: '10%' }}>
            <Card>
              <CardContent>
                <h2>
                  <Check style={{ fontSize: '48px', color: '#54C21F' }} />
                  <br />
                  Anlaysis started!
                </h2>
                <p>
                  Follow the link below to check the status of the analysis.
                </p>
                <p
                  style={{
                    marginTop: '15px'
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
