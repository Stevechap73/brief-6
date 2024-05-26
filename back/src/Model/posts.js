class Posts {
  constructor(
    title,
    body,
    user_id,
    user_name,
    email,
    picture_user,
    picture_post,
    status,
    createdAt
  ) {
    this.title = title;
    this.body = body;
    this.user_id = user_id;
    this.user_name = user_name;
    this.email = email;
    this.picture_user = picture_user;
    this.picture_post = picture_post;
    this.status = status;
    this.createdAt = createdAt;
  }
}
module.exports = { Posts };
