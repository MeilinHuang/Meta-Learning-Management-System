import axios from 'axios';

const API_URL = 'http://localhost:8000';

class PomodoroService {
    createPomodoroLog(data, token) {
        // console.log("sending log,", data, "with token: ", token)
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            Authorization: token
        }

        const payload = {
            "username": data.username,
            "email": data.email,
            "time": new Date(),
            "focusTimeMinutes": data.focusTimeMinutes
        }

        // console.log("sending log", " headers", headers, "data", data)
        return axios.post(`${API_URL}/createPomodoroSession`, payload, {
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

    getThisWeeksLogs(token, startDate, endDate) {
        return axios.get(`${API_URL}/getWeekPomodoroSessions`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                Authorization: token,
                startDate: startDate,
                endDate: endDate
            }
        });
    }
}

export default new PomodoroService();
