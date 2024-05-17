class Posts {
  constructor(title, body, user_id, picture_id, status, createdAt) {
    this.title = title;
    this.body = body;
    this.user_id = user_id;
    this.picture_id = picture_id;
    this.status = status;
    this.createdAt = createdAt;
  }
}
module.exports = { Posts };
