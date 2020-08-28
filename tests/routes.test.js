import moment from 'moment';
import axios from 'axios';

describe('Get all ids for user', () => {
  it('Get all ids for user', () => {
    axios.get('/api/id/1').then((res) => {
    console.log(res);
    });
  });
});
