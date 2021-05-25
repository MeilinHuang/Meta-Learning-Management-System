from app import api,db
from util.globals import *
from util.models import *
from util.request_handling import *
from util.graph import *
from util.export import *
from flask_restplus import Resource, abort, reqparse, fields
from PIL import Image
from io import BytesIO
import base64
import time
from flask import request

topics = api.namespace('topic', description='Topic Services')

# TODO: store some fake data in the db for topic and learning materials
# TODO: export a whole topic
# TODO: create xml documents in python; https://www.google.com/search?q=create+xml+documents+in+python&rlz=1C1CHBF_en-GBAU886AU888&oq=create+xml+documents+in+python&aqs=chrome..69i57j0l3j0i20i263l2j0l2j0i10j0.3712j0j4&sourceid=chrome&ie=UTF-8
# look at and existing imscc structure and try and modify that structrue and experiment to get structures i want
#^ do this last after everything else!


# force topic titles to be first letter upper case and everything else lower case

# come back and add an option to specify disciplien TOOD


# TODO in adding new topic, add the prerequisites in at the same time?
@topics.route('/', strict_slashes=False)
class Topic(Resource):
    #TODO: check against old code logic
    @topics.response(200, 'Success', topic_id_details)
    @topics.response(409, 'Topic Exists')
    @topics.response(403, 'Invalid Auth Token')
    @topics.response(400, 'Malformed Request / Image could not be processed')
    @topics.expect(auth_details,new_topic_details)
    @topics.doc(description='''
        Adds a New Topic and its prerequisites
        // "id"	                    INTEGER,
	    "title"	                    TEXT NOT NULL,
        "description"	            TEXT NOT NULL,
        "group"                     TEXT NOT NULL,
        "discipline"                TEXT NOT NULL,
        "creator"                   INTEGER NOT NULL,
    ''')
    def post(self):
        print('add a topic!')
        # IMPORTANT NOTE - REVAMPED CODE ADDS TOPIC AND PREREQS SEPARATELY!
        u = authorize(request)
        print('USER')
        u_id = u[0] # check this is the right one
        print('user id:',u_id)
        j = get_request_json()
        print('j: ', j)
        (t,desc,grp,disc) = unpack(j, 'title', 'description', 'group', 'discipline')
        print('~~~~~~~~~~~~~~~ADDING TOPIC: ',t,desc,grp,disc )
        
        # format Topic in the expected way where all letter are lower
        # case execpt the first letter
        t = t.capitalize()
        
        
        if t == "":
            abort(400, "title cannot be empty")
        if desc == "":
            abort(400, "description cannot be empty")
        if grp == "":
            abort(400, "group cannot be empty")
        if db.exists('TOPIC').where(title=t):
            # This assumes that topic titles are unique no matter
            # what group or discipline
            abort(409, 'Topic Exists')
        print('ADDING TOPIC: ',t,desc,grp,disc )
        topic_id=db.insert('TOPIC').with_values(
            title=t,
            description=desc,
            group_name=grp,
            discipline=disc,
            creator=u_id
        ).execute()
        return {
            'topic_id': topic_id
        }

    @topics.response(404, 'Topic Not Found')
    @topics.response(403, 'Invalid Auth Token')
    @topics.response(200, 'Success', topic_list_details)
    @topics.expect(auth_details)
    @topics.param('title','Title of the topic')
    @topics.doc(description='''
       Search for a topic based on id or title (if not supplied, then get all  topics)
    ''')
    def get(self):
        u = authorize(request)
        t = get_request_arg('title')
        d = get_request_arg('discipline')
        # id = get_request_arg('id')

        topic_list = []
        group_list = []
        discipline_list = []

        # if id:
        #     # get the topic by id
        #     topic = db.select('TOPIC').where(id=id).execute()
        #     if topic:
        #         return {'topics': [format_topic(topic)]}

        #     abort(404, 'Topic Not Found')
        
        if t:
            #bugged when getting a single topic - inconsistent
            # get the topic by topic name
            t = t.capitalize()
            # otherwise return the topic specified by the string or not found
            topic = db.select('TOPIC').where(title=t).execute()
            if topic:
                return {'topics': [format_topic(topic)]}

            abort(404, 'Topic Not Found')

        # if d is specified - a particular discipline
        if d:
            topics = db.select_all('TOPIC').execute()
            for topic in topics:
                print(topic[4], d)
                # if it is a topic for the discipline we look for
                if(topic[4] == d):
                    print('add topic!')
                    topic_list.append(format_topic(topic))
                #topic[3] group
                # topic[4] discipline
                # only for returning all topics
                if (not topic[3] in group_list):
                    group_list.append(topic[3])
                if (not topic[4] in discipline_list):
                    discipline_list.append(topic[4])
            print('num topics: ', len(topic_list))

            prereqs = db.select_all('PREREQUISITE').execute()

            # get all data in the same request to not lose data integrity when something changes!
            prereq_list = []
            for prereq in prereqs:
                p1 = db.select('TOPIC').where(id=prereq[1]).execute()
                p0 = db.select('TOPIC').where(id=prereq[0]).execute()
                # if both prereq of the relationship are in the discipline specified
                if (p1[4] == d and p0[4] == d):
                    prereq_list.append({ "source" : prereq[1], "target": prereq[0]})


            # return all topics
            print('topic list!', topic_list)
            return {'topics': topic_list, "groups": group_list, "disciplines": discipline_list, 'prerequisites': prereq_list}

        # all topics of all disciplines
        topics = db.select_all('TOPIC').execute()
        for topic in topics:
            topic_list.append(format_topic(topic))
            #topic[3] group
            # topic[4] discipline
            # only for returning all topics
            if (not topic[3] in group_list):
                group_list.append(topic[3])
            if (not topic[4] in discipline_list):
                discipline_list.append(topic[4])
        print('num topics: ', len(topic_list))

        prereqs = db.select_all('PREREQUISITE').execute()

        # get all data in the same request to not lose data integrity when something changes!
        prereq_list = []
        for prereq in prereqs:
            prereq_list.append({ "source" : prereq[1], "target": prereq[0]})
        



        # return all topics
        return {'topics': topic_list, "groups": group_list, "disciplines": discipline_list, 'prerequisites': prereq_list}
        
    
    @topics.response(200, 'Success')
    @topics.response(400, 'Malformed Request')
    @topics.response(404, 'Topic Not Found')
    @topics.response(403, 'Invalid Auth Token')
    @topics.expect(auth_details)
    @topics.param('id','the id of the topic to delete')
    @topics.doc(description='''
        TODO:
        Deletes a topic (incl. its learning materials) in one of three ways:
        - Deletes topic and all its children
        - Deletes topic and updates the prerequisite of children nodes links to it
        - Deletes a topic and leaves children nodes with no prerequisites - DONE
        ^Options to be selected
        4 args - token, id, {option, and list of prereq ids} -- body
    ''')
    def delete(self):
        u = authorize(request)
        id = get_request_arg('id', int, required=True)
        if not db.exists('TOPIC').where(id=id):
            abort(404,'Topic Not Found')
        
        # delete it from being children of other nodes
        db.delete('PREREQUISITE').where(topic=id).execute()

        # TODO other options!
        # delete it from being a parent of other nodes - leaves other nodes alone
        db.delete('PREREQUISITE').where(prerequisite=id).execute()

        # delete this actual topic
        db.delete('TOPIC').where(id=id).execute()

        return {
            'message': 'success'
        }
    
    # IMPORTANT UPDATE PREREQUISITE SEPARATELY?
    @topics.response(200, 'Success')
    @topics.response(403, 'Invalid Auth Token / Unauthorized to edit Topic')
    @topics.response(400, 'Malformed Request')
    @topics.response(404, 'Topic Not Found')
    @topics.param('id','the id of the post to update')
    @topics.expect(auth_details,new_topic_details)
    @topics.doc(description='''
        Updates a topic - title, description, group, discipline
    ''')
    def put(self):
        u = authorize(request)
        j = get_request_json()
        id = get_request_arg('id', int, required=True)
        if not db.exists('TOPIC').where(id=id):
            abort(404, 'Topic Not Found')

        (t,desc,grp, disc) = unpack(j,'title','description','group_name','discipline',required=False)

        # format Topic in the expected way where all letter are lower
        # case execpt the first letter
        t = t.capitalize()
        
        if t == None and desc == None and grp == None and disc == None:
            abort(400, "Expected at least one thing to update.")
        updated = {}
        if t:
            if db.exists('TOPIC').where(title=t):
                existing = db.select('TOPIC').where(title=t).execute()
                if existing[0] != id:
                    abort(404, 'Updated Topic Name Already Exists as another topic')
            updated['title'] = t
        if desc:
            updated['description'] = desc
        if grp:
            updated['group_name'] = grp 
        if disc:
            updated['discipline'] = disc

        db.update('TOPIC').set(**updated).where(id=id).execute()

        return {
            'message': 'success'
        }


@topics.route('/prerequisites', strict_slashes=False)
class Prerequisite(Resource):
    # @topics.response(200, 'Success')
    # @topics.response(403, 'Invalid Auth Token')
    # @topics.response(400, 'Malformed Request')
    # @topics.response(404, 'Topic/Prereq Not Found')
    # @topics.response(409, 'Prerequisites will form a cycle')
    # @topics.expect(auth_details,new_prerequisite_details)
    # @topics.doc(description='''
    #     Adds a prerequisite relationship.
    # ''')
    # def put(self):
    #     u = authorize(request)
    #     j = get_request_json()
    #     print('PUTTTINGGGGGGGGGGGGGGGGGGGGGG')
    #     # (t,prereqs) = unpack(j,'topic','prerequisites')
    #     (t,prereqs) = unpack(j,'id','prerequisites')

    #     print('received topic: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', t, prereqs)
    #     if t == "":
    #         abort(400, 'Topic ID cannot be empty')
    #     if len(prereqs) == 0:
    #         abort(400, 'Prerequisite Topic IDs cannot be empty')
    #     if not db.exists('TOPIC').where(id=t):
    #         abort(404, 'Topic Not Found')



    #     # check the prereq relationship being added is valid
    #     nodes = db.select_all('TOPIC').execute()
    #     edges = db.select_all('PREREQUISITE').execute()


    #     # print('topics: ', nodes, 'prereqs: ', edges, len(nodes))
    #     # create a graph for all the existing prereqs and topics
    #     graph = Graph(len(nodes))
    #     for edge in edges:
    #         # graph.addEdge(int(edge['prerequisite']), int(edge['topic']))

    #         # print('!!~!',edge)
    #         # if the prereq relo exists or happens in reverse
    #         if((edge[0] is t and edge[1] in prereqs) or (edge[1] is t and edge[0] in prereqs)):
    #             abort(409, 'Prerequisites will form a cycle')
    #         graph.addEdge(edge[1], edge[0])
    #         # graph.AddEdge(edge[1], edge[0], False)
    #         # graph.AddEdge(int(edge['prerequisite']), int(edge['topic']))
    #         # print(type(edge['prerequisite']), type(edge['topic']))

    #     # add the new prereqs to this graph
    #     # and check if these prereqs topics exist
    #     # and check if any of them form a connection to itself
    #     for prereq in prereqs:
    #         # if any one of them do not exist
    #         if not db.exists('TOPIC').where(id=prereq):
    #             abort(404, 'Prereq Topic Not Found')
    #         if prereq is t:
    #             # the prereq is the same as the topic
    #             abort(409, 'Prerequisites will form a cycle')
    #         # print('prereq: ', prereq, 't: ', t)
    #         graph.addEdge(prereq,t)
    #         # graph.AddEdge (prereq, t, False)

    #     # print('graph: ', graph.graph)
    #     # check if the enw prereqs will form a cyclic
    #     # if graph.isCyclic(): 
    #     # print('is cycle present? ', graph.isCyclic())
    #     # if graph.IsCyclePresent():
    #     if graph.isCyclic():
    #         # it has a cycle
    #         print("THERES A CYCLE!")
    #         abort(409, 'Prerequisites will form a cycle')

    #     # add all of the relos into db
    #     for prereq in prereqs:
    #         # if it already exists just dont add it again
    #         prereq_id = db.insert('PREREQUISITE').with_values(
    #             topic=t,
    #             prerequisite=prereq,
    #         ).execute()
    
    #     return {
    #         'message': 'success'
    #     }

    @topics.response(403, 'Invalid Auth Token')
    @topics.response(200, 'Success', new_prerequisite_details)
    @topics.expect(auth_details)
    @topics.doc(description='''
       Get all prerequisite relationships.
    ''')
    def get(self):
        u = authorize(request)
        # id = get_request_arg('id')

        # if id:
        #     prereqs = db.select_all('PREREQUISITE').where(topic=id).execute()

        #     prereq_list = []
        #     for prereq in prereqs:
        #         prereq_list.append({ "source" : prereq[1], "target": prereq[0]})
        #     # return prerequisites of the topic
        #     return {'prerequisites': prereq_list}

        prereqs = db.select_all('PREREQUISITE').execute()

        prereq_list = []
        for prereq in prereqs:
            prereq_list.append({ "source" : prereq[1], "target": prereq[0]})
        # return all topics
        return {'prerequisites': prereq_list}

    
    @topics.response(200, 'Success')
    @topics.response(403, 'Invalid Auth Token / Unauthorized to edit Prerequisites')
    @topics.response(400, 'Malformed Request')
    @topics.response(404, 'Topic Not Found')
    @topics.response(409, 'Prerequisites will form a cycle')
    @topics.param('id','the id of the post to update')
    @topics.expect(auth_details,new_prerequisite_details)
    @topics.doc(description='''
        Updates the prerequisite information of a topic.
        Can also be used to delete all prerequisites for a topic.
    ''')
    def put(self):
        u = authorize(request)
        j = get_request_json()
        id = get_request_arg('id', int, required=True)
        print('yoyoyo:', id)

        if not db.exists('TOPIC').where(id=id):
            abort(404, 'Topic Not Found')

        (prereqs,) = unpack(j,'prerequisites')
        # print('PREREQS!', prereqs)
        if prereqs == None:
            abort(400, "Expected a prereq list")

        unchanged = True
        # if the prereqs are all the same - just do nothing
        topic_prereqs = db.select_all('PREREQUISITE').where(topic=id).execute()
        print('topic_prereqs: ',topic_prereqs)
        # for prereq in topic_prereqs:
        #     print('prereq[1]', prereq[1], prereqs)
        #     if prereq[1] not in prereqs:
        #         unchanged = False

        for prereq in topic_prereqs:
            print('prereq[1]', prereq[1], prereqs)
            if prereq[1] not in prereqs:
                unchanged = False

        for prereq in prereqs:
            # if the topic id does not have a prereq of this unchanged is false
            if not db.exists('PREREQUISITE').where(topic=id, prerequisite=prereq):
                unchanged = False
        
        if unchanged == True and len(topic_prereqs) != 0:
            print('unchanged!')
            return {
                'message': 'success'
            }
        
        # check if the new prereqs will form a cycle

        # remove all prereqs for this topic

        # update it according to the prereqs list


        # db.update('TOPIC').set(**updated).where(id=id).execute()

        ####
        # check the prereq relationship being added is valid
        nodes = db.select_all('TOPIC').execute()
        edges = db.select_all('PREREQUISITE').execute()


        # print('topics: ', nodes, 'prereqs: ', edges, len(nodes))
        # create a graph for all the existing prereqs and topics (except for
        # prereqs of the current topic to edit)

        num_nodes = len(nodes) + 1
        print('num nodes', nodes)
        graph = Graph(num_nodes)
        for edge in edges:
            # # if the prereq relo exists or happens in reverse
            # if((edge[0] is id and edge[1] in prereqs) or (edge[1] is t and edge[0] in prereqs)):
            #     abort(409, 'Prerequisites will form a cycle')

            # only add edges which are not a prereq for this current topic
            if not edge[0] == id:
                print('edges added in graph: ', edge[1],  edge[0])
                graph.addEdge(edge[1], edge[0])

        # add the new prereqs to this graph
        # and check if these prereqs topics exist
        # and check if any of them form a connection to itself
        print('all prereqs: ', prereqs)
        for prereq in prereqs:
            # print('PREREQ!', prereq)
            # if any one of them do not exist
            if not db.exists('TOPIC').where(id=prereq):
                abort(404, 'Prereq Topic Not Found')
            if prereq is id:
                # the prereq is the same as the topic
                abort(409, 'Prerequisites will form a cycle')
            print('edges added in graph: ', prereq, id)
            graph.addEdge(prereq,id)

        # print('graph: ', graph.graph)
        # check if the enw prereqs will form a cyclic
        # if graph.isCyclic(): 
        # print('is cycle present? ', graph.isCyclic())
        # if graph.IsCyclePresent():
        if graph.isCyclic():
            # it has a cycle
            print("THERES A CYCLE!")
            abort(409, 'Prerequisites will form a cycle')

        # valid to update
        # remove all prereq relos with the current otpic
        db.delete('PREREQUISITE').where(topic=id).execute()

        # add all of the new relos into db
        for prereq in prereqs:
            # if it already exists just dont add it again
            prereq_id = db.insert('PREREQUISITE').with_values(
                topic=id,
                prerequisite=prereq,
            ).execute()

        return {
            'message': 'success'
        }

#TODO!
# Token c385a13b38e36ac78deeb3ebbd846025f28232255b7eb517755f4ce0f51b7797
@topics.route('/export', strict_slashes=False)
class Export(Resource):
    @topics.response(200, 'Success')
    @topics.response(403, 'Invalid Auth Token')
    @topics.response(400, 'Malformed Request')
    @topics.response(404, 'Topic Not Found')
    @topics.param('id','the id of the topic to export')
    @topics.param('export_type','the type of exported file')
    @topics.expect(auth_details)
    @topics.doc(description='''
        Exports all material and information of a topic in one of the
        following forms:
        1. ZIP 1
        2. Common Catridge (TODO) 2
    ''')
    def get(self):
        u = authorize(request)
        # j = get_request_json()
        id = get_request_arg('id', int, required=True)
        export_type = get_request_arg('export_type', int, required=True)

        print('PARAMS RECEIVED: ', id, export_type)

        # check topic exists
        if not db.exists('TOPIC').where(id=id):
            abort(404,'Topic Not Found')

        # extract topic information
        topic = db.select('TOPIC').where(id=id).execute()
        # print('topic~~~~', topic)
        # print('topic~~~~',format_topic_with_files(topic))
        topic_info = format_topic_with_files(topic)

        # meta data store in a README.md folder in the topic;
        # title
        # prerequisites
        # description
        # group
        # discipline
        # creator

        # topic materials, store in respective folders and zipped up

        # meta, preparation_list, content_list, practice_list, assessment_list


        if export_type == EXPORT_TYPE.ZIP.value:
            # export as zip file
            print('export as zip!')
            encoded_zip = create_topic_zip(topic_info)

            return {
                # 'name': topic_info['title'] + '.zip',
                'name': 'export.zip',
                'file': encoded_zip
            }
        elif export_type == EXPORT_TYPE.CC.value:
            # export as common catridge module
            print('export as common cartridge!')
            encoded_cc = create_topic_cc(topic_info)
            return {
                # 'name': topic_info['title'] + '.zip',
                'name': 'export.imscc',
                'file': encoded_cc
            }

        # if not db.exists('POST').where(id=id):
        #     abort(404, 'Post Not Found')
        # (comment,) = unpack(j,'comment')
        # if comment == "":
        #     abort(400, 'Comment cannot be empty')
        # comment_id = db.insert('COMMENT').with_values(
        #     comment=comment,
        #     author=u[1],
        #     published=str(time.time())
        # ).execute()
        # p = db.select('POST').where(id=id).execute()
        # comment_list = text_list_to_set(p[7],process_f=lambda x: int(x))
        # comment_list.add(comment_id)
        # comment_list = set_to_text_list(comment_list)
        # db.update('POST').set(comments=comment_list).where(id=id).execute()
        # return {
        #     'message': 'success'
        # }
