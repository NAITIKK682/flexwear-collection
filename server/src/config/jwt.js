const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

module.exports = {
  JWT_SECRET,
  JWT_EXPIRE
};
