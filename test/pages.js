const request = require('request');
const axios = require('axios');
const expect  = require('chai').expect;

describe('Backend Assessment', function() {
  describe('Step 1', function() {
    it('Will return status code for correct route', function(done) {
      request('http://localhost:2222/api/ping', function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
      });
    });
    it('Should return the correct status code for step 1 where route is incorrect', function(done) {
      request('http://localhost:2222/api/pings', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });
    it('Will return body correctly', function(done) {
        request('http://localhost:2222/api/ping', function(error, response, body) {
            expect(body).to.equal('{"success":"true"}');
            done();
        });
    });
  })
  describe('Step 2', function() {
    it('Will return status code for correct route', function(done) {
      request('http://localhost:2222/api/posts/tech', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('Will return correct status code for wrong route', function(done) {
      request('http://localhost:2222/api/post/tech', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });
    it('Will return status code when all three parameters are passed', function(done) {
      request('http://localhost:2222/api/posts/health,tech/likes/desc', function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
      });
    });
    it('Will return status code where no tag mentioned', function(done) {
      request('http://localhost:2222/api/posts', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });
    it('Will pass the test if all posts are unique by id', function(done) {
      axios.get('http://localhost:2222/api/posts/tech,history')
      .then(res => {
        let myDataID = [];
        let myDataObj = {};
        let myData = res.data;
        let test = true;
        for (let i = 0; i < myData.length; i++) {
          myDataID.push(myData[i].id)
        }

        myDataID.forEach(blog => {
          myDataObj[blog] = myDataObj[blog] ? myDataObj[blog] + 1 : 1
        })
   
        for (let key in myDataObj) {
          if (myDataObj[key] > 1) { // More than one values for id, So test will fail
            test = false
          }
        }
        expect(test).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
    it('Will pass the test if all posts are unique with route parameters', function(done) {
      axios.get('http://localhost:2222/api/posts/tech,history/likes/asc')
      .then(res => {
        let myDataObj = {};
        let myDataID = [];
        let myData = res.data;
        let test = true;

        for (let i = 0; i < myData.length; i++) {
          myDataID.push(myData[i].id)
        }
        myDataID.forEach(blog => {
          myDataObj[blog] = myDataObj[blog] ? myDataObj[blog] + 1 : 1
        })
        for (let key in myDataObj) {
          if (myDataObj[key] > 1) { // More than one values for id, So test will fail
            test = false
          }
        }
        expect(test).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
    it('Will pass the test if user didnt use the default parameneter and sorted values are correct', function(done) {
      axios.get('http://localhost:2222/api/posts/tech,health')
      .then(res => {
        let test = true;
        let myDataID = [];
        let myData = res.data;
        for (let i = 0; i < myData.length; i++) {
          myDataID.push(myData[i].id)
        }
        for (let i = 0; i < myDataID.length; i++) {
          if (myDataID[i] > myDataID[i + 1]) {
            test = false;
          }
        }
        expect(test).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
    it('Will pass test if sorted values are correct', function(done) {
      axios.get('http://localhost:2222/api/posts/tech,health/likes/desc')
      .then(res => {
        let myDataLikes = [];
        let myData = res.data;
        let test = true;
        for (let i = 0; i < myData.length; i++) {
          myDataLikes.push(myData[i].likes)
        }
        for (let i = 0; i < myDataLikes.length; i++) {
          if (myDataLikes[i] < myDataLikes[i + 1]) { 
            test = false;
          }
        }
        expect(test).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
  });
});
