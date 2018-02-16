import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';

chai.use(chaiHttp);
let should = chai.should();

describe('index', () => {
    it('should successfully GET index', done => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });
});