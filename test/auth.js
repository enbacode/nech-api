import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);

let should = chai.should(); // eslint-disable-line no-unused-vars

describe('auth/login', () => {
    it('should return 400 with no fields', done => {
        chai
            .request(server)
            .post('/auth/login')
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                done();
            });
    });
    it('should return 400 with username only', done => {
        chai
            .request(server)
            .post('/auth/login')
            .send({ username: 'enba' })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                done();
            });
    });

    it('should return 200 with token using correct credentials', done => {
        chai
            .request(server)
            .post('/auth/login')
            .send({ username: 'super', password: 'test1234' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('token');
                res.body.should.have.property('user');
                done();
            });
    });
});
