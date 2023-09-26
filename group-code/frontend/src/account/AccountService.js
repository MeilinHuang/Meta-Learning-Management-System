import axios from 'axios';
// import nodemailer from 'nodemailer';

const API_URL = ' http://127.0.0.1:8000';
class AccountService {
  register(param) {
    return axios.post(`${API_URL}/register`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }

  login(param) {
    console.log('logining1');
    return axios.post(`${API_URL}/login`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }

  logout(param) {
    console.log('loging out');
    console.log(param)
    return axios.post(`${API_URL}/logout`,param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: param.access_token
      }
    });
  }

  editProfile(param) {
    return axios.post(`${API_URL}/editProfile`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: param.access_token
      }
    });
  }

  changePw(param) {
    console.log(param)
    return axios.post(`${API_URL}/changePassword`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: param.access_token
      }
    })
  }

  findOpenAssessmentByUserToken(param) {
    console.log(param);
    return axios.post(`${API_URL}/user/lookup/assessment/open`, param)
  }

  loadTopicMark(param) {
    console.log(param)
    return axios.post(`${API_URL}/loadAssessmentMain`, param);
  }

  loadUsers(param) {
    return axios.get(`${API_URL}/loadUsers/${param.search}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: localStorage.getItem('access_token')
      }
    });
  }

  getOneUser(param) {
    console.log(param);
    return axios.get(`${API_URL}/user/${param.id}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: localStorage.getItem('access_token')
      }
    });
  }

  sendMessage(param) {
    console.log('sendMessage');
    console.log(param)
    return axios.post(`${API_URL}/sendMessage`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }

  createConversation(param) {
    console.log('createConversation');
    console.log(param)
    return axios.post(`${API_URL}/createConversation`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }

  getConversations(param) {
    console.log("getConversations")
    console.log(param)
    return axios.post(`${API_URL}/getAllConversations`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }

  getOneConversation(param) {
    console.log(param)
    return axios.get(`${API_URL}/api/items/${param.conversation_name}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: localStorage.getItem('access_token')
      }
    });
  }

  promoteAdmin(param) {
    console.log(param)
    return axios.post(`${API_URL}/admin/promote`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    })
  }

  demoteAdmin(param) {
    console.log(param)
    return axios.post(`${API_URL}/admin/demote`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    })
  }

  getAdmins() {
    return axios.get(`${API_URL}/admin/listsuperusers`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    })
  }

  getNonAdmins() {
    return axios.get(`${API_URL}/admin/listNonSuperusers`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    })
  }

  addUserToConversation(param) {
    console.log(param)
    return axios.post(`${API_URL}/addUserToConversation`,param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    })
  }
  
  vEmail(param) {
    console.log(param)
    return axios.post(`${API_URL}/vEmail`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  }

  inputOtp(param) {
    console.log(param)
    return axios.post(`${API_URL}/putOtp`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  }

  recoverPass(param) {
    console.log(param)
    return axios.post(`${API_URL}/recoverPass`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  }

  setMFA(param) {
    console.log(param)
    return axios.post(`${API_URL}/setMFA`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  }

  verifyMFA(param) {
    console.log(param)
    return axios.post(`${API_URL}/verifyMFA`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  }

  putPicture(param) {
    console.log(param)
    return axios.post(`${API_URL}/putPicture`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  }

  getPicture(param) {
    console.log(param);
    return axios.get(`${API_URL}/getPicture/${param.id}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }
  mutalTopicsRoless(param) {
    return axios.get(`${API_URL}/mutalTopicsRoles/${param.id2}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: localStorage.getItem('access_token')
      }
    });
  }

  notifications(param) {
    return axios.get(`${API_URL}/notifications`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: localStorage.getItem('access_token')
      }
    });
  }

  activityStatus(param) {
    return axios.get(`${API_URL}/activityStatus/${param.id}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: localStorage.getItem('access_token')
      }
    });
  }

  setPrivacy(param) {
    return axios.post(`${API_URL}/setPrivacy`, param, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: localStorage.getItem('access_token')
      }
    })
  }

  getPrivacy(param) {
    return axios.get(`${API_URL}/getPrivacy/${param.id}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Authorization: localStorage.getItem('access_token')
      }
    });
  }
}
export default new AccountService();
