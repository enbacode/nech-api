import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';

chai.use(chaiHttp);

describe('auth/login', () => {
    it('should return 400 with no fields', done => {
        chai.request(server)
            .post('/auth/login')
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                done();
            });
    });
});