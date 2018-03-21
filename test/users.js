import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);
let should = chai.should(); // eslint-disable-line no-unused-vars

describe('GET /users', () => {
    it('should return all users', done => {
        chai
            .request(server)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                res.body.length.should.be.eql(2);
                done();
            });
    });
});

describe('GET /users/:name', () => {
    it('should return a user', done => {
        chai
            .request(server)
            .get('/users/user1')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('object');
                res.body.should.have.property('username');
                res.body.should.have.property('role');
                res.body.should.not.have.property('password');
                done();
            });
    });
});

describe('GET /users/:name/nechs', () => {
    it('should return nechs', done => {
        chai
            .request(server)
            .get('/users/user1/nechs')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });
});

describe('GET /users/:name/nechs/:type', () => {
    it('should return nechs when type is nech', done => {
        chai
            .request(server)
            .get('/users/user1/nechs/nech')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });
    it('should return trivials when type is trivial', done => {
        chai
            .request(server)
            .get('/users/user1/nechs/trivial')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });
    it('should return klars when type is klar', done => {
        chai
            .request(server)
            .get('/users/user1/nechs/klar')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });
});

describe('GET /users/me', () => {
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
