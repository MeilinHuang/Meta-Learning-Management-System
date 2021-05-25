from app import api,db
from util.globals import *
from util.models import *
from util.request_handling import *
from flask_restplus import Resource, abort, reqparse, fields
from PIL import Image
from io import BytesIO
import base64
import time
from flask import request

materials = api.namespace('material', description='Material Services')

# https://www.browserling.com/tools/file-to-base64
# https://base64.guru/converter/decode/file
# https://www.google.com/search?q=can+zip+files+be+converted+to+base64&rlz=1C1CHBF_en-GBAU886AU888&oq=can+zip+files+be+converted+to+base64&aqs=chrome..69i57j33i22i29i30l8.4366j0j7&sourceid=chrome&ie=UTF-8
@materials.route('/', strict_slashes=False)
class Material(Resource):
    @materials.response(200, 'Success')
    @materials.response(403, 'Invalid Auth Token')
    @materials.response(400, 'Malformed Request / Image could not be processed')
    @materials.response(409, 'Material(s) uploaded cause duplicate names')
    @materials.expect(auth_details,new_material_list_details)
    @materials.param('id','the id of the topic to add materials to')
    @materials.doc(description='''
        Uploads new file(s) accepted in bytes (Base64) for a particular topic and category
        (1 2 3 or 4)
    ''')
    def post(self):
        u = authorize(request)
        u_id = u[0]
        j = get_request_json()
        t_id = get_request_arg('id', int, required=True)
        (cat,mats) = unpack(j,'category','materials')
        if cat == "":
            abort(400, "category cannot be empty")
        if mats is None or len(mats) == 0:
            abort(400, "materials cannot be empty")
        # thumbnail = self._gen_thumbnail(src)

        # check that the file name does not already exist for this topic and stage
        for mat in mats:
            # if any are dup in name, don't upload any
            #print('CHECK: ',mat['name'], u_id, cat, t_id)
            if db.exists('MATERIAL').where(id=t_id, category=cat, name=mat['name']):
                # abort(409, 'Material(s) uploaded because duplicate names')
                # replace it
                db.update('MATERIAL').set(**updated).where(topic=t_id,category=cat,name=mat['name']).execute()
                return {
                    'message': 'success'
                }

        for mat in mats:
           
            db.insert('MATERIAL').with_values(
                name=mat['name'],
                file=mat['file'],
                time=str(time.time()),
                creator=u_id,
                category=cat,
                version=1,
                topic=t_id # TODO: default to one version - add more
            ).execute()
        return {
            'message': 'success'
        }

    @materials.response(200, 'Success')
    @materials.response(400, 'Malformed Request')
    @materials.response(404, 'Topic/Material Not Found')
    @materials.response(403, 'Invalid Auth Token')
    @materials.expect(auth_details)
    @materials.param('id','the id of the topic to delete from')
    @materials.param('category','the category this file is from')
    @materials.param('name','the name of the file')
    @materials.doc(description='''
        Deletes a learning material
    ''')
    def delete(self):
        u = authorize(request)
        id = get_request_arg('id', int, required=True)
        cat = get_request_arg('category', int, required=True)
        n = get_request_arg('name', str, required=True)

        if not db.exists('TOPIC').where(id=id):
            abort(404,'Topic Not Found')
        if not db.exists('MATERIAL').where(topic=id,category=cat,name=n):
            abort(404, 'Material Not Found')
        
        # delete it from being children of other nodes
        db.delete('MATERIAL').where(topic=id,category=cat,name=n).execute()

        return {
            'message': 'success'
        }

    @materials.response(200, 'Success')
    @materials.response(403, 'Invalid Auth Token / Unauthorized to edit Topic')
    @materials.response(400, 'Malformed Request')
    @materials.response(404, 'Topic Not Found')
    @materials.param('id','the id of the topic to delete from')
    @materials.param('category','the category this file is from')
    @materials.param('name','the current name of the file')
    @materials.expect(auth_details,new_material_details)
    @materials.doc(description='''
        Updates a material - material name or content, does not
        update any other meta data
    ''')
    def put(self):
        u = authorize(request)
        j = get_request_json()

        id = get_request_arg('id', int, required=True)
        cat = get_request_arg('category', int, required=True)
        n = get_request_arg('name', str, required=True)

        if not db.exists('TOPIC').where(id=id):
            abort(404,'Topic Not Found')
        if not db.exists('MATERIAL').where(topic=id,category=cat,name=n):
            abort(404, 'Material Not Found')

        (new_n, f) = unpack(j,'name','file',required=False)
        
        if new_n == None and f == None:
            abort(400, "Expected at least one thing to update.")
        updated = {}
        if new_n:
            updated['name'] = new_n
        if f:
            updated['file'] = f

        db.update('MATERIAL').set(**updated).where(topic=id,category=cat,name=n).execute()

        return {
            'message': 'success'
        }

    @materials.response(404, 'Topic/Material Not Found')
    @materials.response(403, 'Invalid Auth Token')
    @materials.response(200, 'Success')
    @materials.expect(auth_details)
    @materials.param('id','Id of the topic')
    @materials.param('category', 'Category of topic (int)')
    @materials.param('filename', 'name of the file')
    @materials.doc(description='''
       Get the src file of a particular material
    ''')
    def get(self):
        u = authorize(request)
        id = get_request_arg('id')
        category_num = int(get_request_arg('category'))
        filename = get_request_arg('filename')

        print('id: ', id, 'catgoery: ', category_num, 'filename: ', filename)
        # material = db.select('MATERIAL').where(id=id, category=category_num, name=filename).execute()
        material = db.select('MATERIAL').where(topic=id,  category=category_num, name=filename).execute()
        print('id: ', id, 'catgoery: ', category_num, 'filename: ', filename, 'material: ', material[5], material[1])

        if material is None:
            abort(404, 'Material not found!')

        return {
            'name': filename,
            'file': material[2]
        }
# def _gen_thumbnail(self, src):
#     try:
#         size = (150,150)
#         im = Image.open(BytesIO(base64.b64decode(src)))
#         im.thumbnail(size, Image.ANTIALIAS)
#         buffered = BytesIO()
#         im.save(buffered, format='PNG')
#         return base64.b64encode(buffered.getvalue()).decode("utf-8")
#     except:
#         abort(400,'Image Data Could Not Be Processed')

#     @posts.response(200, 'Success')
#     @posts.response(403, 'Invalid Auth Token / Unauthorized to edit Post')
#     @posts.response(400, 'Malformed Request')
#     @posts.response(404, 'Post Not Found')
#     @posts.param('id','the id of the post to update')
#     @posts.expect(auth_details,new_post_details)
#     @posts.doc(description='''
#         Lets you update a post without changing metadata.
#         Published date, likes, comments etc. will be left untouched.
#         At least one of the paramaters must be supplied.
#         The id of the post to update must also be supplied,
#         a invalid id will make the request be considered malformed.
#         The current user pointed to by the auth token must be
#         the author of the post pointed to by id otherwise a
#         unauthorized error will be raised.
#     ''')
#     def put(self):
#         u = authorize(request)
#         u_username = u[1]
#         j = get_request_json()
#         id = get_request_arg('id', int, required=True)
#         if not db.exists('POST').where(id=id):
#             abort(404, 'Post Not Found')
#         # check the logged in user made this post
#         post_author = db.select('POST').where(id=id).execute()[1]
#         if u[1] != post_author:
#             # exposing what post id's are valid and unvalid
#             # may be a security issue lol
#             abort(403, 'You Are Unauthorized To Edit That Post')
#         (desc,src) = unpack(j,'description_text','src',required=False)
#         if desc == None and src == None:
#             abort(400, "Expected at least 'description_text' or 'src'")
#         updated = {}
#         if desc:
#             updated['description'] = desc
#         if src:
#             updated['src'] = src
#             updated['thumbnail'] = self._gen_thumbnail(src)
#         db.update('POST').set(**updated).where(id=id).execute()
#         return {
#             'message': 'success'
#         }

#     @posts.response(200, 'Success')
#     @posts.response(400, 'Malformed Request')
#     @posts.response(404, 'Post Not Found')
#     @posts.response(403, 'Invalid Auth Token')
#     @posts.expect(auth_details)
#     @posts.param('id','the id of the post to delete')
#     @posts.doc(description='''
#         Lets you delete the post referenced by 'id'.
#         id must be supplied and the user pointed to by
#         the auth token must be the author of the post.
#         If the user is not the autor of the post referenced
#         by 'id' a unauthorized error is raised.
#         If id is invalid or not supplied the request is considered
#         malformed.
#     ''')
#     def delete(self):
#         u = authorize(request)
#         id = get_request_arg('id', int, required=True)
#         if not db.exists('POST').where(id=id):
#             abort(404,'Post Not Found')
#         p = db.select('POST').where(id=id).execute()
#         if p[1] != u[1]:
#             abort(403,'You Are Unauthorized To Make That Request')
#         comment_list = text_list_to_set(p[7])
#         [db.delete('COMMENT').where(id=c_id).execute() for c_id in comment_list]
#         db.delete('POST').where(id=id).execute()
#         return {
#             'message': 'success'
#         }

#     @posts.response(200, 'Success',post_details)
#     @posts.response(400, 'Malformed Request')
#     @posts.response(404, 'Post Not Found')
#     @posts.response(403, 'Invalid Auth Token')
#     @posts.expect(auth_details)
#     @posts.param('id','the id of the post to fetch')
#     @posts.doc(description='''
#         Lets you fetch a post referenced by 'id'.
#         id must be supplied and valid, the request is considered
#         malformed otherwise.
#         The returned object contains standard information such as
#         the description text, username of the author, and published time
#         as a UNIX Time Stamp.
#         In addition the meta section of the object contains a list of user id's
#         of the users who have liked the post.
#         The src is supplied in base64 encoding as is a thumbnail, also base64 encoded.
#         The thumbnail is of size 150px by 150px.
#         There is also a list of comments supplied. Each comment has the comment text,
#         the username of the author who made the comment and a UNIX timestamp of
#         the the comment was posted.
#     ''')
#     def get(self):
#         u = authorize(request)
#         id = get_request_arg('id', int, required=True)
#         p = db.select('POST').where(id=id).execute()
#         if not p:
#             abort(404,'Post Not Found')
#         return format_post(p)

# @posts.route('/like', strict_slashes=False)
# class Like(Resource):
#     @posts.response(200, 'Success')
#     @posts.response(403, 'Invalid Auth Token')
#     @posts.response(400, 'Malformed Request')
#     @posts.response(404, 'Post Not Found')
#     @posts.param('id','the id of the post to like')
#     @posts.expect(auth_details)
#     @posts.doc(description='''
#         Lets the user pointed to by the auth token like
#         the post referenced by 'id'.
#         'id' must be supplied and valid, the request is considered
#         malformed otherwise.
#         If the post is already liked by the user pointed to by the auth token
#         nothing is done.
#     ''')
#     def put(self):
#         u = authorize(request)
#         id = get_request_arg('id', int, required=True)
#         if not db.exists('POST').where(id=id):
#             abort(404, 'Post Not Found')
#         p = db.select('POST').where(id=id).execute()
#         likes = text_list_to_set(p[4],process_f=lambda x:int(x))
#         likes.add(u[0])
#         likes = set_to_text_list(likes)
#         db.update('POST').set(likes=likes).where(id=id).execute()
#         return {
#             'message': 'success'
#         }

# @posts.route('/unlike', strict_slashes=False)
# class Unlike(Resource):
#     @posts.response(200, 'Success')
#     @posts.response(403, 'Invalid Auth Token')
#     @posts.response(400, 'Malformed Request')
#     @posts.response(404, 'Post Not Found')
#     @posts.param('id','the id of the post to unlike')
#     @posts.expect(auth_details)
#     @posts.doc(description='''
#         Lets the user pointed to by the auth token unlike
#         the post referenced by 'id'.
#         'id' must be supplied and valid, the request is considered
#         malformed otherwise.
#         If the post is not liked by the user pointed to by the auth token
#         nothing is done.
#     ''')
#     def put(self):
#         u = authorize(request)
#         id = get_request_arg('id', int, required=True)
#         if not db.exists('POST').where(id=id):
#             abort(404, 'Post Not Found')
#         p = db.select('POST').where(id=id).execute()
#         likes = text_list_to_set(p[4],process_f=lambda x: int(x))
#         likes.discard(u[0])
#         likes = set_to_text_list(likes)
#         db.update('POST').set(likes=likes).where(id=id).execute()
#         return {
#             'message': 'success'
#         }

# @posts.route('/comment', strict_slashes=False)
# class Comment(Resource):
#     @posts.response(200, 'Success')
#     @posts.response(403, 'Invalid Auth Token')
#     @posts.response(400, 'Malformed Request')
#     @posts.response(404, 'Post Not Found')
#     @posts.param('id','the id of the post to comment on')
#     @posts.expect(auth_details,new_comment_details)
#     @posts.doc(description='''
#         Lets the user pointed to by the auth token comment on
#         the post referenced by 'id'.
#         'id' must be supplied and valid, the request is considered
#         malformed otherwise.
#         The posted json must contain a "comment" field with a non
#         empty comment as the value, otherwise the request is considered
#         malformed.
#     ''')
#     def put(self):
#         u = authorize(request)
#         j = get_request_json()
#         id = get_request_arg('id', int, required=True)
#         if not db.exists('POST').where(id=id):
#             abort(404, 'Post Not Found')
#         (comment,) = unpack(j,'comment')
#         if comment == "":
#             abort(400, 'Comment cannot be empty')
#         comment_id = db.insert('COMMENT').with_values(
#             comment=comment,
#             author=u[1],
#             published=str(time.time())
#         ).execute()
#         p = db.select('POST').where(id=id).execute()
#         comment_list = text_list_to_set(p[7],process_f=lambda x: int(x))
#         comment_list.add(comment_id)
#         comment_list = set_to_text_list(comment_list)
#         db.update('POST').set(comments=comment_list).where(id=id).execute()
#         return {
#             'message': 'success'
#         }
