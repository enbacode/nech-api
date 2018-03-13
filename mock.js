let users = [
    {
        username: 'super',
        password: 'test1234',
        role: 'super'
    },
    {
        username: 'user1',
        password: 'test1234',
        role: 'unverified'
    }
];

let lessons = [
    {
        type: 'LA',
        from: new Date('2018-04-01T09:00:00'),
        to: new Date('2018-04-01T10:30:00')
    },
    {
        type: 'ANA',
        from: new Date('2018-04-02T08:30:00'),
        to: new Date('2018-04-02T10:00:00')
    }
];

let nechs = [
    {
        type: 'nech'
    },
    {
        type: 'nech'
    },
    {
        type: 'nech'
    },
    {
        type: 'nech'
    },
    {
        type: 'trivial'
    },
    {
        type: 'trivial'
    },
    {
        type: 'klar'
    },
    {
        type: 'klar'
    }
];

module.exports = { users: users, nechs: nechs, lessons: lessons };
