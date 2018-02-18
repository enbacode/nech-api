import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './app';

chai.use(chaiHttp);

module.exports = {
    getSuperToken() {
        chai
            .request(server)
            .post('/auth/login')
            .send({ username: 'super', password: 'test1234' })
            .end()
            .then(value => {
                return value.body.token;
            });
    }
};
