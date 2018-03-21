import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);
let should = chai.should(); // eslint-disable-line no-unused-vars

describe('GET /nechs', () => {
    it('should return nechs', done => {
        chai
            .request(server)
            .get('/nechs')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });
});

describe('POST /nechs', () => {
    it('should return 401 without token', done => {
        chai
            .request(server)
            .post('/nechs')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
    it('should return 200 with token', done => {
        chai
            .request(server)
            .post('/auth/login')
            .send({ username: 'user1', password: 'test1234' })
            .end((loginErr, loginRes) => {
                chai
                    .request(server)
                    .post('/nechs')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
            });
    });
});

describe('POST /nechs/klar', () => {
    it('should return 401 without token', done => {
        chai
            .request(server)
            .post('/nechs/klar')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
    it('should return 200 with token', done => {
        chai
            .request(server)
            .post('/auth/login')
            .send({ username: 'user1', password: 'test1234' })
            .end((loginErr, loginRes) => {
                chai
                    .request(server)
                    .post('/nechs/klar')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
            });
    });
});

describe('POST /nechs/trivial', () => {
    it('should return 401 without token', done => {
        chai
            .request(server)
            .post('/nechs/trivial')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
    it('should return 200 with token', done => {
        chai
            .request(server)
            .post('/auth/login')
            .send({ username: 'user1', password: 'test1234' })
            .end((loginErr, loginRes) => {
                chai
                    .request(server)
                    .post('/nechs/trivial')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
            });
    });
});

describe('GET /nechs/:id', () => {
    it('should return 404 when id is unknown', done => {
        chai
            .request(server)
            .get('/nechs/unknownid123')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    it('should return 200 when id exists', done => {
        chai
            .request(server)
            .get('/nechs')
            .end((getErr, getRes) => {
                console.log(getRes);
                chai
                    .request(server)
                    .get(`/nechs/${getRes.body[0].id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
            });
    });
});
