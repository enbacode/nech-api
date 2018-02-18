import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import authHelper from '../authHelper';

chai.use(chaiHttp);
let should = chai.should(); // eslint-disable-line no-unused-vars

describe('users/me', () => {
    it('should return a user', done => {
        chai
            .request(server)
            .get('/users/me')
            .set('Authorization', 'Bearer ' + authHelper.getSuperToken())
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });
});
