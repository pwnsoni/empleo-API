const postController = require('../controllers/jobs');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
    router.route('/auth/posts')
      .post(validateToken, postController.add)
      .get(postController.getAll);

      router.route('/posts')
      .get(postController.getAll);

      router.route('/auth/myPosts')
        .get(validateToken, postController.getMyPosts);

    router.route('/auth/posts/:_id')
        .put(validateToken, postController.updatePost)
        .delete(validateToken, postController.deletePost)

    router.route('/posts/:_id')
      .get(postController.getThisPost);
    
    // router.route('/post/:jobId')
    //   .get(userController.login);

  };