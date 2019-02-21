const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const app = require('../app.js');
const userHelper = require('../helpers/userHelper.js');
const taxHelper = require('../helpers/taxHelper.js');
chai.use(chaiHTTP);

let token = '';
const firstPrice = 500;
const secondPrice = 1000;
const thirdPrice = 2000;
describe('Testing creating tax object for user', function () {
  before(function(done) {
    userHelper.create(done);
  })

  before(function(done) {
    chai.request(app)
      .post('/user/signin')
      .send( { email: 'testing@gmail.com', password: '1234'})
      .end(function (err, res) {
        token = res.body.token;
        done(); 
      })

  })

  it('should create tax object when all fields are not empty and status code 200', (done) => {
      chai.request(app)
          .post('/tax')
          .send({ name: "test tax", taxCode: 1, price: 1000 })
          .set({ token: token })
          .end(function (err, res) {
              expect(res).to.have.status(201);
              expect(res.body).to.have.keys(['data', 'info']);
              expect(res.body.info).to.include("Tax object is successfully created");
              done()
          })
  })

  it('should return error with status code 404 when user is not login (no token)', (done) => {
    chai.request(app)
        .post('/tax')
        .send({ name: "test tax", taxCode: 1, price: 1000 })
        .end(function (err, res) {
            expect(res).to.have.status(404);
            expect(res.body).to.have.keys(['info', 'err']);
            expect(res.body.err).to.include("Token doesn't exist");
            done()
        })
  })

  it ('should return error with status code 400 when one of the field is not present while creating tax object', (done) => {
    chai.request(app)
      .post('/tax')
      .send({ name: "test tax", price: 1000 })
      .set({ token: token })
          .end(function (err, res) {
              expect(res).to.have.status(400);
              expect(res.body).to.have.keys(['info', 'err']);
              expect(res.body.info).to.include('Failed to create tax data');
              expect(res.body.err).to.include('Tax.taxCode cannot be null');
              done()
          })
  })

  it ('should return error with status code 400 when one of the field value is empty', (done) => {
    chai.request(app)
      .post('/tax')
      .send({ name: "test tax 1", taxCode: 1, price: "" })
      .set({ token: token })
          .end(function (err, res) {
              expect(res).to.have.status(400);
              expect(res.body).to.have.keys(['info', 'err']);
              expect(res.body.info).to.include('Failed to create tax data');
              expect(res.body.err).to.include('taxCode cannot be empty');
              done()
          })
  })

  after(function(done) {
    userHelper.delete(done)
  })

  after(function(done) {
    taxHelper.delete(done)
  })
})

describe('Testing calculating tax for user', function () {
  before(function(done) {
    userHelper.create(done);
  })

  before(function(done) {
    chai.request(app)
      .post('/user/signin')
      .send( { email: 'testing@gmail.com', password: '1234'})
      .end(function (err, res) {
        token = res.body.token;
        done(); 
      })
  })

  before(function(done) {
    chai.request(app)
      .post('/tax')
      .send({ name: "test tax", taxCode: 1, price: firstPrice })
      .set({ token: token })
      .end(function (err, res) {
        chai.request(app)
          .post('/tax')
          .send({ name: "test tax 1", taxCode: 2, price: secondPrice })
          .set({ token: token })
          .end(function (err, res) {
            chai.request(app)
              .post('/tax')
              .send({ name: "test tax 2", taxCode: 3, price: thirdPrice })
              .set({ token: token })
              .end(function (err, res) {
                  done()
              })
          })       
      })
  })

   /*
    assuming that first item always itemcode 1, 
      second item always taxcode 2, 
      third item always taxcode 3 for this testing
  */
  it('should return status code 200 and user bill when user exist and have the tax objects', (done) => {
    let subTotalPrice = firstPrice + secondPrice + thirdPrice;
    let subTotalTax = (firstPrice * 0.1) + (10 + (secondPrice * 0.02)) + (0.01 * (thirdPrice - 100));
    let grandTotal = subTotalPrice + subTotalTax;

    chai.request(app)
      .get('/tax')
      .set({ token: token })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.keys(['data', 'info']);
        expect(res.body.data).to.have.keys(['subTotalPrice', 'items', 'subTotalTax', 'grandTotal']);
        expect(res.body.data.subTotalTax).to.equal(subTotalTax);
        expect(res.body.data.subTotalPrice).to.equal(subTotalPrice);
        expect(res.body.data.grandTotal).to.equal(grandTotal);
        taxHelper.delete(done);
      })
  })

  it('should return status code 404 when user doest not have tax data', (done) => {
    chai.request(app)
      .get('/tax')
      .set({ token: token })
      .end(function (err, res) {
        expect(res).to.have.status(404);
        expect(res.body).to.have.keys(['info']);
        expect(res.body.info).to.include('No data found');
        done();
      })
  })

    after(function(done) {
      userHelper.delete(done)
    })
})