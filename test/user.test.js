const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const app = require('../app.js');
const userHelper = require('../helpers/userHelper.js');
const taxHelper = require('../helpers/taxHelper.js');
chai.use(chaiHTTP);

describe('Testing user feature', function () {
  it('should return status code 201 when user is successfully created', (done) => {
      chai.request(app)
          .post('/user/signup')
          .send({ name: "robert", email: 'testing@gmail.com', password: '1234' })
          .end(function (err, res) {
              expect(res).to.have.status(201);
              expect(res.body).to.have.keys(['data', 'info']);
              expect(res.body.data).to.have.keys(['id', 'name', 'email', 'createdAt', 'updatedAt']);
              expect(res.body.info).to.include('Successfully create user');
              done()
          })
  })

  it('should return error with status code 404 when one of the field is empty', (done) => {
    chai.request(app)
        .post('/user/signup')
        .send({ name: "", email: 'testing1@gmail.com', password: '1234' })
        .end(function (err, res) {
            expect(res).to.have.status(400);
            expect(res.body).to.have.keys(['info', 'err']);
            expect(res.body.err).to.include('Name cannot be less than 2 chars and more than 100 chars');
            done()
        })
  })

  it('should return status code 200 and token when user is successfully sign in', (done) => {
    chai.request(app)
      .post('/user/signin')
      .send({ email: 'testing@gmail.com', password: '1234' })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.keys(['info', 'token']);
        expect(res.body.info).to.include('User successfully sign in');
        done()
      })
  })

  it('should return status code 404 when password is wrong', (done) => {
    chai.request(app)
      .post('/user/signin')
      .send({ email: 'testing@gmail.com', password: '123456' })
      .end(function (err, res) {
        expect(res).to.have.status(404);
        expect(res.body).to.have.keys(['info', 'err']);
        expect(res.body.info).to.include('User failed to sign in');
        expect(res.body.err).to.include('Password is incorrect');
        done()
      })
  })

  it('should return status code 404 when user does not exist', (done) => {
    chai.request(app)
      .post('/user/signin')
      .send({ email: 'testin1234g@gmail.com', password: '1234' })
      .end(function (err, res) {
        expect(res).to.have.status(404);
        expect(res.body).to.have.keys(['info', 'err']);
        expect(res.body.info).to.include('User failed to sign in');
        expect(res.body.err).to.include(`User doesn't exist`);
        done()
      })
  })


  after(function(done) {
    userHelper.delete(done)
  })
})