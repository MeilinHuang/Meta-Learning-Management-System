import axios from 'axios';

const API_URL = 'http://localhost:8000';

class PomodoroService {
    createPomodoroLog(data, token) {
        console.log("sending log,", data, "with token: ", token)
        return axios.post(`${API_URL}/createPomodoroSession`, data, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                Authorization: token
            }
        });
    }

    getAllPomodoroLogs(token) {
        return axios.get(`${API_URL}/getAllPomodoroSessions`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                Authorization: token
            }
        });
    }
}

export default new PomodoroService();
