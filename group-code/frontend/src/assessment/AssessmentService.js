import axios from 'axios';
const API_URL = ' http://127.0.0.1:8000';

class AssessmentService {
  loadMain(param) {
    console.log(param)
    return axios.post(`${API_URL}/loadAssessmentMain`, param);
  }

  checkAssessmentPermission(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/edit/check/permision`, param);
  }

  assessmentDetail(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/detail`, param)
  }

  renderAssessmentAttempt(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/attempt/render`, param)
  }

  renderAssignment(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/assignment/render`, param)
  }

  downloadInstruction(param) {
    console.log(param)
    return axios.get(`${API_URL}/assessment/assignment/download/instruction`, { params: param })
  }

  submitAssignment(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/assignment/upload`, param)
  }

  submitPracAttempt(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/attempt/pracattp`, param)
  }

  assessmentOverviewEdit(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/edit/overview`, param)
  }

  assessmentAttemptTestOverview(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/attempt/test/overview`, param)
  }

  renderAssessmentAttemptMark(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/attempt/mark/render`, param)
  }

  updateAttemptMark(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/attempt/mark/update`, param)
  }

  renderAssessmentSubmitMark(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/submit/mark/render`, param)
  }

  // updateSubmitMark(param) {
  //   console.log(param)
  //   return axios.post(`${API_URL}/assessment/submit/mark/update`, param)
  // }
  getAttemptList(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/attempt/list`, param)
  }

  updateAssessmentArribute(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/update/attribute`, param)
  }
  addNewAssessment(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/add`, param)
  }

  addNewQuestionInAssessment(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/question/add`, param)
  }

  updateQuestionInAssessment(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/question/update`, param)
  }

  deleteQuestionInAssessment(param) {
    //console.log(param)
    return axios.post(`${API_URL}/assessment/question/delete`, param)
  }

  deleteAssessment(param) {
    console.log(param)
    return axios.post(`${API_URL}/assessment/delete`, param)
  }

}

export default new AssessmentService();
