async function extractToken(request) {
  const headerWithToken = request.headers.authorization;
  if (typeof headerWithToken !== undefined || !headerWithToken) {
    const bearer = headerWithToken.split(" ");
    const token = bearer[1];
    return token;
  }
}

module.exports = { extractToken };
