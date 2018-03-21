import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);
let should = chai.should(); // eslint-disable-line no-unused-vars

describe('users/me', () => {
    it('should return 401 w/o token', done => {
        chai
            .request(server)
            .get('/users/me')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
    it('should return user data after authorizing', done => {
        chai
            .request(server)
            .post('/auth/login')
            .send({ username: 'user1', password: 'test1234' })
            .end((loginErr, loginRes) => {
                chai
                    .request(server)
                    .get('/users/me')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
            });
    });
});
