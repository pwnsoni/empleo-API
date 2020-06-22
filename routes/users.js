const userController = require('../controllers/users');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
  router.route('/auth/users')
    .post(userController.add)
    .get(validateToken, userController.getAll) // This route will be protected
    .put(validateToken, userController.update);
  
  router.route('/login')
    .post(userController.login);

  router.route('/users/:userName')
    .get( userController.getUser);

  router.route('/auth/currentUser')
    .get(validateToken, userController.getCurrentUser);

  router.route('/auth/test')
    .get(validateToken, (req, res) => {
        res.send( req.decoded.user +  "Its workin!!!!!!");
    })
};