class Posts {
  constructor(
    title,
    body,
    user_id,
    picture_id,
    picture_post,
    status,
    createdAt
  ) {
    this.title = title;
    this.body = body;
    this.user_id = user_id;
    this.picture_id = picture_id;
    this.picture_post = picture_post;
    this.status = status;
    this.createdAt = createdAt;
  }
}
module.exports = { Posts };
