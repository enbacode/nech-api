import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);
let should = chai.should(); // eslint-disable-line no-unused-vars

describe('/', () => {
    it('should successfully GET index', done => {
        chai
            .request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });
});
