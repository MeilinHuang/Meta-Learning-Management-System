# based on COMP6080 backend code
import sqlite3

class Stub:
    def __init__(self, conn_url, type, q):
        self.q = q
        self.type = type
        self.q_values = tuple()
        self.conn_url = conn_url

    def set(self, **kargs):
        if self.type != "UPDATE":
            raise Exception("Can not use 'SET' on a '{}' command".format(self.type))
        sets = ["{} = ?".format(x) for x in kargs]
        if (len(sets) > 0):
            self.q += " SET {}".format(", ".join(sets))
        self.q_values += tuple(kargs.values())
        return self

    def where(self, **kargs):
        search_params = ["{} = ?".format(x) for x in kargs]
        if (len(search_params) > 0):
            self.q += " WHERE {}".format(" AND ".join(search_params))
        self.q_values += tuple(kargs.values())
        return self
    def with_values(self, **kargs):
        keys = ",".join(kargs.keys())
        values = [kargs[k] for k in kargs.keys()]
        ph = ",".join(["?" for k in kargs.keys()])
        self.q += "({}) VALUES({})".format(keys,ph);
        self.q_values += tuple(values)
        return self
    def limit(self, n):
        self.q += " LIMIT "+n
        return self
    def execute(self):
        conn = sqlite3.connect(self.conn_url)
        c = conn.cursor()
        # since the last python update we can now
        # assume kargs are ordered :D
        # print('!!!', self.q_values, self.q)
        c.execute(self.q,self.q_values)
        if (self.type == "EXISTS"):
            r = (c.fetchone() != None)
        elif (self.type == "UPDATE" or self.type == "INSERT" or self.type == "DELETE"):
            conn.commit()
            r = c.lastrowid
        elif (self.type == "SELECT"):
            r = c.fetchone()
        elif (self.type == "SELECT_ALL"):
            r = c.fetchall()
        else:
            raise Exception("Unknown Stub type '{}'".format(self.type))
        
        conn.close()
        return r

    def __bool__(self):
        if (self.type == "EXISTS"):
            return self.execute()
        return True

class DB:
    def __init__(self):
        self.conn_url = "db/database.sqlite3"
        self.exist_queries = {
            
            "POST": "SELECT ID FROM POSTS",
            "COMMENT": "SELECT ID FROM COMMENTS",

            "USER" : "SELECT EMAIL FROM USERS",
            "TOPIC": "SELECT ID FROM TOPICS",
            "PREREQUISITE": "SELECT TOPIC, PREREQUISITE FROM PREREQUISITES",
            "MATERIAL": "SELECT ID FROM MATERIALS"
        }
        self.update_queries = {
            "POST": "UPDATE POSTS",
            "COMMENT": "UPDATE COMMENTS",

            "USER" : "UPDATE USERS",
            "TOPIC": "UPDATE TOPICS",
            "PREREQUISITE": "UPDATE PREREQUISITES",
            "MATERIAL": "UPDATE MATERIALS"
        }
        self.select_queries = {
            "POST": "SELECT * FROM POSTS",
            "COMMENT": "SELECT * FROM COMMENTS",

            "USER" : "SELECT ID,NAME,EMAIL FROM USERS",
            "TOPIC": "SELECT * FROM TOPICS",
            "PREREQUISITE": "SELECT * FROM PREREQUISITES",
            "MATERIAL": "SELECT * FROM MATERIALS"
        }
        self.insert_queries = {
            "POST": "INSERT INTO POSTS",
            "COMMENT": "INSERT INTO COMMENTS",

            "USER" : "INSERT INTO USERS",
            "TOPIC": "INSERT INTO TOPICS",
            "PREREQUISITE": "INSERT INTO PREREQUISITES",
            "MATERIAL": "INSERT INTO MATERIALS"
        }
        self.delete_queries = {
            "POST": "DELETE FROM POSTS",
            "COMMENT": "DELETE FROM COMMENTS",

            "USER": "DELETE FROM USERS",
            "TOPIC": "DELETE FROM TOPICS",
            "PREREQUISITE": "DELETE FROM PREREQUISITES",
            "MATERIAL": "DELETE FROM MATERIALS"
        }
    def raw(self, q, params):
        conn = sqlite3.connect(self.conn_url)
        c = conn.cursor()
        c.execute(q,tuple(params))
        r = c.fetchall()
        conn.commit()
        conn.close()
        return r
    def exists(self, query_name, **kargs):
        s = Stub(self.conn_url, "EXISTS", self.exist_queries[query_name])
        return s
    def delete(self, query_name, **kargs):
        s = Stub(self.conn_url, "DELETE", self.delete_queries[query_name])
        return s
    def insert(self, query_name, **kargs):
        s = Stub(self.conn_url, "INSERT", self.insert_queries[query_name])
        return s
    def select(self, query_name, **kargs):
        s = Stub(self.conn_url, "SELECT", self.select_queries[query_name])
        return s
    def select_all(self, query_name, **kargs):
        s = Stub(self.conn_url, "SELECT_ALL", self.select_queries[query_name])
        return s
    def update(self, query_name, **kargs):
        s = Stub(self.conn_url, "UPDATE", self.update_queries[query_name])
        return s
