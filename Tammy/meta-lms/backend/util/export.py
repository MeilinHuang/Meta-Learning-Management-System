import os

import base64
import shutil

from mdutils.mdutils import MdUtils
from mdutils import Html

from util.cc import *

# write up everythign in report, redesigns/refactors, challenges with graph and common cartdige
# graph visualiation
# experience and learnings
# adjustment in tech
# documentation

# https://stackoverflow.com/questions/2323128/convert-string-in-base64-to-image-and-save-on-filesystem-in-python
# https://stackoverflow.com/questions/1855095/how-to-create-a-zip-archive-of-a-directory-in-python

# {
#     "id": topic_tuple[0],
#     "title": topic_tuple[1],
#     "prerequisite_strings": prerequisite_list,
#     "description": topic_tuple[2],
#     "materials_strings":{
#         "preparation": [{"name": "dfsdf", "file": "dsfasjkfkhjk=3"}],
#         "content":  content_material_list,
#         "practice":  practice_material_list,
#         "assessment":  assessment_material_list,
#     },
#     "group": topic_tuple[3],
#     "discipline": topic_tuple[4],
#     "creator": creator_name
# }

# CREATES ZIP

# creates the empty directory structure with the desired content
def create_directories(topic_name):
    # creates the directory hierarchical structure
    root_dir = topic_name
    main_dir_names = ['Preparation', 'Content', 'Practice','Assessment']
    # Create directory
    for i in range(0, len(main_dir_names)):
        dirName = 'exports/raws/' + str(root_dir) + '/' + str(main_dir_names[i])
        print('directory created: ', dirName)
        try:
            # Create target Directory
            os.makedirs(dirName)
            print("Directory " , dirName ,  " Created ") 
        except FileExistsError:
            print("Directory " , dirName ,  " already exists")        
        
        # Create target Directory if don't exist
        if not os.path.exists(dirName):
            os.makedirs(dirName)
            print("Directory " , dirName ,  " Created ")
        else:    
            print("Directory " , dirName ,  " already exists")

def fill_up_directory(topic_name, category, material_list):
    # category e.g. Preparation
    # material_list e.g. [{"name": "dfsdf", "file": "dsfasjkfkhjk=3"}]

    path = 'exports/raws/' + topic_name + '/' + category
    
    for material in material_list:
        with open(path + "/" + material['name'], "wb") as fh:
            fh.write(base64.b64decode(material['file']))

# adds a README.md
def add_topic_meta_data(topic_name, prerequisite_list, description, group, discipline, creator):
    # https://mdutils.readthedocs.io/en/latest/examples/Example_Python.html
    #     "title": topic_tuple[1],
    #     "prerequisite_strings": prerequisite_list,
    #     "description": topic_tuple[2],
    #     "materials_strings":{
    #         "preparation": [{"name": "dfsdf", "file": "dsfasjkfkhjk=3"}],
    #         "content":  content_material_list,
    #         "practice":  practice_material_list,
    #         "assessment":  assessment_material_list,
    #     },
    #     "group": topic_tuple[3],
    #     "discipline": topic_tuple[4],
    #     "creator": creator_name
    mdFile = MdUtils(file_name='exports/raws/' + topic_name + '/README', title='Topic Overview')
    # mdFile.new_header(level=1, title='Topic: ' + topic_name)

    mdFile.new_header(level=1, title='Topic')
    mdFile.write(topic_name)

    mdFile.new_header(level=1, title='Description')
    mdFile.write(description)

    mdFile.new_header(level=1, title='Prerequisites of the Topic')
    if len(prerequisite_list) == 0:
        prereqs_str = 'None'
    else:
        prereqs_str = ','.join(prerequisite_list)    
    mdFile.write(prereqs_str)

    mdFile.new_header(level=1, title='Group')
    mdFile.write(group)

    mdFile.new_header(level=1, title='Discipline')
    mdFile.write(discipline)

    mdFile.new_header(level=1, title='Creator')
    mdFile.write(creator)

    mdFile.create_md_file()

def create_topic_dir(topic_obj):
    # create the required directories (empty)
    create_directories(topic_obj['title'])

    # TODO: add a readme.md file with data
    add_topic_meta_data(topic_obj['title'], topic_obj['prerequisite_strings'], topic_obj['description'], topic_obj['group'], topic_obj['discipline'], topic_obj['creator'])

    # fill out the directory with the desired files
    # preparation content
    fill_up_directory(topic_obj['title'], "Preparation", topic_obj['materials_strings']['preparation'])
    
    # content content
    fill_up_directory(topic_obj['title'], "Content", topic_obj['materials_strings']['content'])
    
    # practice content
    fill_up_directory(topic_obj['title'], "Practice", topic_obj['materials_strings']['practice'])

    # assessment content
    fill_up_directory(topic_obj['title'], "Assessment", topic_obj['materials_strings']['assessment'])

# https://medium.com/@pushkarkadam1994/automation-create-folder-structures-using-python-fc7b3a53b95e
def create_topic_zip(topic_obj):
    print("received topic object: ", topic_obj['title'])
    
    create_topic_dir(topic_obj)

    # zip it up 
    # https://stackoverflow.com/questions/1855095/how-to-create-a-zip-archive-of-a-directory-in-python
    topic_dir = 'exports/raws'
    topic_zip_dir = 'exports/zips/' + 'export'
    shutil.make_archive(topic_zip_dir, 'zip', topic_dir)

    # and convert into base64
    # https://stackoverflow.com/questions/11511705/base64-encode-a-zip-file-in-python
    # print('file to convert to base64: ', topic_zip_dir)
    print('current dir: ', os.getcwd(), os.listdir())
    with open(topic_zip_dir + '.zip', "rb") as f:
        bytes = f.read()
        encoded = base64.b64encode(bytes)
    # print('bytessss base64: ', encoded)
    # # remove/clean up it
    # shutil.rmtree()
    # # shutil.rmtree(topic_dir)
    shutil.rmtree('exports/raws')
    shutil.rmtree('exports/zips')

    # return it
    # https://stackoverflow.com/questions/606191/convert-bytes-to-a-string
    return encoded.decode("utf-8") # return as a string instead of bytes
    

# # def create_topic_cc(topic_obj):
# create_directories('Test Topic 1')

############################################################################

# CREATES COMMON CATRIDGE FOR A TOPIC
def fill_up_cc(topic_name,material_list):
    # category e.g. Preparation
    # material_list e.g. [{"name": "dfsdf", "file": "dsfasjkfkhjk=3"}]

    path = 'exports/cc_raws/' + topic_name + '/web_resources'
    
    for material in material_list:
        with open(path + "/" + material['name'], "wb") as fh:
            fh.write(base64.b64decode(material['file']))

def create_cc_directories(topic_name):
    root_dir = topic_name
   
    dirName = 'exports/cc_raws/' + str(root_dir) + '/web_resources'
    try:
        # Create target Directory
        os.makedirs(dirName)
        print("Directory " , dirName ,  " Created ") 
    except FileExistsError:
        print("Directory " , dirName ,  " already exists")        
    
    # Create target Directory if don't exist
    if not os.path.exists(dirName):
        os.makedirs(dirName)
        print("Directory " , dirName ,  " Created ")
    else:    
        print("Directory " , dirName ,  " already exists")

def fill_cc_xml(topic_obj):
    
    all_lines= create_topic_xml(topic_obj)
    print('ALL LINES:!~~~~~~~~', all_lines)
    dirName = 'exports/cc_raws/' + topic_obj['title'] +'/'
    outF = open(dirName + "imsmanifest.xml", "w+")
    outF.writelines(all_lines)
    outF.close()
    return

def create_topic_cc(topic_obj):
    # create the directories
    create_cc_directories(topic_obj['title'])
    # create_cc_directories('export')

    # fill in the webresources
    fill_up_cc(topic_obj['title'],topic_obj['materials_strings']['preparation'])
    fill_up_cc(topic_obj['title'],topic_obj['materials_strings']['content'])
    fill_up_cc(topic_obj['title'],topic_obj['materials_strings']['practice'])
    fill_up_cc(topic_obj['title'],topic_obj['materials_strings']['assessment'])

    # fill in the imsmanifest.xml file
    fill_cc_xml(topic_obj)


    # zip it up 
    # https://stackoverflow.com/questions/1855095/how-to-create-a-zip-archive-of-a-directory-in-python
    topic_dir = 'exports/cc_raws/' + topic_obj['title']
    topic_zip_dir = 'exports/cc/' + 'export'
    shutil.make_archive(topic_zip_dir, 'zip', topic_dir)

    # rename the extension from .zip to .imscc
    os.rename(topic_zip_dir +'.zip', topic_zip_dir +'.imscc')
    
    # and convert into base64
    # https://stackoverflow.com/questions/11511705/base64-encode-a-zip-file-in-python
    # print('file to convert to base64: ', topic_zip_dir)
    print('current dir: ', os.getcwd(), os.listdir())
    with open(topic_zip_dir + '.imscc', "rb") as f:
        bytes = f.read()
        encoded = base64.b64encode(bytes)
    # print('bytessss base64: ', encoded)
    # # remove/clean up it
    # shutil.rmtree()
    # # shutil.rmtree(topic_dir)
    shutil.rmtree('exports')

    # # return it
    # # https://stackoverflow.com/questions/606191/convert-bytes-to-a-string
    return encoded.decode("utf-8") # return as a string instead of bytes

