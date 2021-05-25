import secrets
from app import db
from flask_restplus import Resource, abort, reqparse, fields
import enum
# https://www.tutorialspoint.com/enum-in-python#:~:text=Enum%20is%20a%20class%20in,enum%20has%20the%20following%20characteristics.
class CATEGORY(enum.Enum):
    PREPARATION = 1
    CONTENT = 2
    PRACTICE = 3
    ASSESSMENT = 4

class EXPORT_TYPE(enum.Enum):
    ZIP = 1
    CC = 2 # common catridge

def unpack(j,*args,**kargs):
    if kargs.get("required",True):
        not_found = [arg for arg in args if arg not in j]
        if not_found:
            expected = ", ".join(map(str, not_found))
            abort(kargs.get("error",400), "Expected request object to contain: " + expected)
    return [j.get(arg, None) for arg in args]

def gen_token():
    token = secrets.token_hex(32)
    while db.exists("USER").where(curr_token=token):
        token = secrets.token_hex(32)
    return token

def authorize(r):
    # Probably not the best way of doing this
    if r.path.startswith("/dummy"):
        return get_dummy_user()

    t = r.headers.get('Authorization',None)
    
    # print('tokeeeennn', t, r.headers)
    if not t:
        abort(403,'Unsupplied Authorization Token')
    try:
        t = t.split(" ")[1]
    except:
        abort(400,"Authorization Token must start with 'Token'")

    # print(t, db.exists("USER").where(curr_token=t).execute())
    if not db.exists("USER").where(curr_token=t).execute():
        # print('grr')
        abort(403,'Invalid Authorization Token')
    return db.select("USER").where(curr_token=t).execute()

def get_dummy_user():
    return db.select("USER").where(id=1).execute()

def text_list_to_set(raw,process_f=lambda x:x):
    if raw == None:
        return set()
    return set([process_f(x) for x in raw.split(",") if x != ''])

def set_to_text_list(l):
    return ",".join([str(x) for x in l])

def format_post(post):
    comments = []
    for c_id in text_list_to_set(post[7],process_f=lambda x:int(x)):
        comment = db.select("COMMENT").where(id=c_id).execute()
        comments.append({
            "author":  comment[1],
            "published":  comment[2],
            "comment": comment[3]
        })
    return {
        "id": post[0],
        "meta": {
            "author": post[1],
            "description_text": post[2],
            "published": post[3],
            "likes": list(text_list_to_set(post[4],process_f=lambda x:int(x)))
        },
        "thumbnail": post[5],
        "src": post[6],
        "comments": comments
    }

def format_topic(topic_tuple):
    # print(topic_tuple)

    # PREREQS: go to prereqs table and find ones matching topic id for topic
    prerequisite_list = []
    prereqs = db.select_all("PREREQUISITE").where(topic=topic_tuple[0]).execute()
    for prereq in prereqs:
        # prereq[1] is the prerequiste's id
        prereq_str = db.select("TOPIC").where(id=prereq[1]).execute()
        prerequisite_list.append(prereq_str[1])

    # CREATOR: get the topic creator name
    # topic_tuple[5] has the user id
    creator_name = db.select("USER").where(id=topic_tuple[5]).execute()[1]

    # MATERIALS: get all file names for this topic
    preparation_material_list = []
    content_material_list = []
    practice_material_list = []
    assessment_material_list = []
    materials = db.select_all("MATERIAL").where(topic=topic_tuple[0]).execute()
    for material in materials:
        c = material[5]
       
        if c is CATEGORY.PREPARATION.value:
            preparation_material_list.append(material[1])
        elif c is CATEGORY.CONTENT.value:
            content_material_list.append(material[1])
        elif c is CATEGORY.PRACTICE.value:
            practice_material_list.append(material[1])
        elif c is CATEGORY.ASSESSMENT.value:
            assessment_material_list.append(material[1])

    return {
        "id": topic_tuple[0],
        "title": topic_tuple[1],
        "prerequisite_strings": prerequisite_list,
        "description": topic_tuple[2],
        "materials_strings":{
            "preparation": preparation_material_list,
            "content":  content_material_list,
            "practice":  practice_material_list,
            "assessment":  assessment_material_list,
        },
        "group": topic_tuple[3],
        "discipline": topic_tuple[4],
        "creator": creator_name
    }


def format_topic_with_files(topic_tuple):
    # print(topic_tuple)

    # PREREQS: go to prereqs table and find ones matching topic id for topic
    prerequisite_list = []
    prereqs = db.select_all("PREREQUISITE").where(topic=topic_tuple[0]).execute()
    for prereq in prereqs:
        # prereq[1] is the prerequiste's id
        prereq_str = db.select("TOPIC").where(id=prereq[1]).execute()
        prerequisite_list.append(prereq_str[1])

    # CREATOR: get the topic creator name
    # topic_tuple[5] has the user id
    creator_name = db.select("USER").where(id=topic_tuple[5]).execute()[1]

    # MATERIALS: get all file names for this topic
    preparation_material_list = []
    content_material_list = []
    practice_material_list = []
    assessment_material_list = []
    materials = db.select_all("MATERIAL").where(topic=topic_tuple[0]).execute()
    for material in materials:
        c = material[5]
       
        if c is CATEGORY.PREPARATION.value:
            preparation_material_list.append({'name': material[1], 'file': material[2]})
        elif c is CATEGORY.CONTENT.value:
            content_material_list.append({'name': material[1], 'file': material[2]})
        elif c is CATEGORY.PRACTICE.value:
            practice_material_list.append({'name': material[1], 'file': material[2]})
        elif c is CATEGORY.ASSESSMENT.value:
            assessment_material_list.append({'name': material[1], 'file': material[2]})

    return {
        "id": topic_tuple[0],
        "title": topic_tuple[1],
        "prerequisite_strings": prerequisite_list,
        "description": topic_tuple[2],
        "materials_strings":{
            "preparation": preparation_material_list,
            "content":  content_material_list,
            "practice":  practice_material_list,
            "assessment":  assessment_material_list,
        },
        "group": topic_tuple[3],
        "discipline": topic_tuple[4],
        "creator": creator_name
    }