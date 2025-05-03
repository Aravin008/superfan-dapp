const baseUrl = "http://localhost:3001";

const configBase = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  }
};

const updateProfile = async (payload) => {
  const url = baseUrl + "/api/user/profile";
  const config = { 
    ...configBase,
    method: "POST" 
  };

  config.body = JSON.stringify(payload)

  return makeRequest(url, config);
}

const fetchProfile = (accountId) => {
  const url = baseUrl + '/api/user/profile/' + accountId;
  const config = { 
    ...configBase
  };
  return makeRequest(url, config);
}

const submitFeedbackForm = (feeback) => {
  const url = baseUrl + '/api/feedback';
  const config = {
    ...configBase,
    method: "POST",
    body: JSON.stringify(feeback)
  };
  return makeRequest(url, config);
}

const fetchNonce = (address) => {
  const url = baseUrl + '/api/auth/request-nonce';
  const config = {
    ...configBase,
    method: "POST",
    body: JSON.stringify({ address })
  };
  return makeRequest(url, config);
}

const verifyUser = (address, signature, message) => {
  const url = baseUrl + '/api/auth/verify';
  const config = {
    ...configBase,
    method: "POST",
    body: JSON.stringify({ address, signature, message }),
  };
  return makeRequest(url, config);
}

const loggingOut = () => {
  const url = baseUrl + '/api/auth/logout';
  const config = {
    ...configBase,
    method: 'POST'
  };
  return makeRequest(url, config);
}

const getMe = () => {
  const url = baseUrl + '/api/user/me';
  const config = {
    ...configBase,
  };
  return makeRequest(url, config);
}

const getMessageList = (nextPage) => {
  const url = baseUrl + '/api/message/list?page=' +  nextPage;
  const config = {
    ...configBase,
  };
  return makeRequest(url, config);
}

const getMessageListWithReplies = (nextPage) => {
  const url = baseUrl + '/api/message/with-replies?page=' +  nextPage;
  const config = {
    ...configBase,
  };
  return makeRequest(url, config);
}

const getMessageListByAccountId = (accountId, type, nextPage) => {
  let url = baseUrl + '/api/message/list';
  const params = new URLSearchParams();
  params.append('page', nextPage);
  params.append('accountId', accountId);
  params.append('type', type);
  const queryString = params.toString();
  url = url + '?' + queryString;
  const config = {
    ...configBase,
  };
  return makeRequest(url, config);
}

const getMessageListByAccountIdWithReplies = (accountId, type, nextPage) => {
  let url = baseUrl + '/api/message/with-replies';
  const params = new URLSearchParams();
  params.append('page', nextPage);
  params.append('accountId', accountId);
  params.append('type', type);
  const queryString = params.toString();
  url = url + '?' + queryString;
  const config = {
    ...configBase,
  };
  return makeRequest(url, config);
}

const getMessage = (msgId) => {
  const url = baseUrl + '/api/message/' + msgId;
  const config = {
    ...configBase,
  };
  return makeRequest(url, config);
}

const getMessageWithReply = (msgId) => {
  const url = baseUrl + '/api/message/with-reply/' + msgId;
  const config = {
    ...configBase,
  };
  return makeRequest(url, config);
}

const getCreators = (search, exact, page=1, limit=10) => {
  let url = baseUrl + '/api/user/creators';
  const params = new URLSearchParams();
  params.append('search', search);
  params.append('exact', exact);
  params.append('page', page);
  params.append('limit', limit);
  const queryString = params.toString();
  url = url + '?' + queryString;

  const config = {
    ...configBase,
  };

  return makeRequest(url, config);
}

const makeRequest = async (url, config) => {
  const data = await fetch(url, {
    ...config,
    credentials: "include"
  });
  return await data.json();
}

export {
  updateProfile,
  fetchProfile,
  submitFeedbackForm,
  fetchNonce,
  verifyUser,
  getMe,
  loggingOut,
  getMessageList,
  getMessageListWithReplies,
  getMessage,
  getCreators,
  getMessageListByAccountId,
  getMessageListByAccountIdWithReplies,
  getMessageWithReply
}