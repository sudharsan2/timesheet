/* eslint-disable prefer-template */
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';

export default function SupportDashboard() {
  const [chartData, setChartData] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios
      .get('https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/getDashBoardDetails', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('OverAll Support GET', res.data);
        setChartData(res.data);
      })
      .catch((err) => {
        console.log('OverAll Support GET Error', err);
      });
  }, []);

  return (
    <div>
      <Typography
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: '#89CFF3',
          mt: -3,
          '@media (max-width: 768px)': {
            ml: -40
          }
        }}
      >
        Support Project Dashboard
      </Typography>
      <Grid container spacing={2}>
        {chartData.map((support, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Link to={`support-review/${support.projectName}`}>
              <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent style={{ flex: '1 0 auto' }}>
                  <Typography variant="h6" gutterBottom>
                    {support.projectName}
                  </Typography>
                  <BarChart width={200} height={160} data={[support]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="project_NAME" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reported" fill="#4169E1" name="Reported" />
                    <Bar dataKey="closed" fill="#228B22" name="Closed" />
                    <Bar dataKey="open" fill="#FF0000" name="Open" />
                  </BarChart>
                  <div style={{ maxHeight: '75px', overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>
                      Open Summary:
                    </Typography>
                    <div>
                      {support.openSummary.map((item, i) => (
                        <div key={i}>
                          {item.moduleName}: {item.moduleCount}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
