

# <item identifier="pointers-preparation">
#     <title> Preparation </title> <!-- topic category --> 
# </item>

# topic e.g. pointers, 
# category e.g. preparation
def create_category_item(topic, category):
    identifier = topic.replace(" ", "").lower() + '-' + category.lower()
    title = category.capitalize() # prep, contnemt practice, assess
    return '''
    <item identifier="{}">
        <title>{}</title>
    </item>
    '''.format(identifier, title)


# <item identifier="pointers---motivation-for-learning" identifierref="pointers-preparation-pointers---motivation-for-learning">
#     <title>Pointers - Motivation for Learning</title>
# </item>

# topic = e.g. pointers
# category = e.g. Preparation
# filename e.g. slide(.pdf)
def create_material_item(topic, category, filename):
    identifier = topic.replace(" ", "").lower() + '-' + category.lower() + '-' + filename.split('.')[0].replace(" ", "").replace("(", "").replace(")", "").lower()
    identifierref = identifier + '-ref'
    title = filename
    
    return '''
    <item identifier="{}" identifierref="{}">
        <title>{}</title>
    </item>
    '''.format(identifier, identifierref, title)


# <item identifier="pointers-content">
#     <title> Content </title> <!-- topic category --> 
# </item>
# <item identifier="lecture-slides" identifierref="pointers-content-lecture-slides">
#     <title>Lecture Slides.pdf</title>
# </item>
# <item identifier="pointers---walkthrough-coding" identifierref="pointers-content-pointers---walkthrough-coding">
#     <title>Pointers - Walkthrough (Coding).mp4</title>
# </item>
# <item identifier="pointers---walkthrough-using-a-swap-function" identifierref="pointers-content-pointers---walkthrough-using-a-swap-function">
#     <title>Pointers - Walkthrough using a swap function.mp4</title>
# </item>

# material list [{name:, file:}]
def create_category(topic,category, material_list):
    category_item = create_category_item(topic, category)

    material_item_list = []
    for material in material_list:
        material_item = create_material_item(topic, category, material['name'])
        material_item_list.append(material_item)

    return category_item + '\n'.join(material_item_list)

def create_learning_module(topic_obj):
    print('topic obj in cc: ', topic_obj['title'])
    title = topic_obj['title'] # the topic
    topic_title_item = '''
    <title>{}</title>
    '''.format(title)

    preparation_category_item = create_category(topic_obj['title'],'Preparation', topic_obj['materials_strings']['preparation'])
    content_category_item = create_category(topic_obj['title'],'Content', topic_obj['materials_strings']['content'])
    practice_category_item = create_category(topic_obj['title'],'Practice', topic_obj['materials_strings']['practice'])
    assessment_category_item = create_category(topic_obj['title'],'Assessment', topic_obj['materials_strings']['assessment'])
    
    list = ['<item identifier="{}">'.format(title.replace(" ", "").lower()), topic_title_item, preparation_category_item, content_category_item, practice_category_item, assessment_category_item, '</item>']
   
   

    return '\n'.join(list)

###
# <resource type="webcontent" identifier="pointers-preparation-pointers---motivation-for-learning" href="web_resources/Pointers - Motivation for Learning.mp4">
#     <file href="web_resources/Pointers - Motivation for Learning.mp4"/>
# </resource>
def create_resource_item(topic, category, filename):
    identifier = topic.replace(" ", "").lower() + '-' + category.lower() + '-' + filename.split('.')[0].replace(" ", "").replace("(", "").replace(")", "").lower() + '-ref'
    href = 'web_resources/' + filename
    return '''
    <resource type="webcontent" identifier="{}" href="{}">
        <file href="{}"/>
    </resource>
    '''.format(identifier, href, href)

def create_resources_section(topic_obj):
    resource_item_list = []
    for resource in topic_obj['materials_strings']['preparation']:
        resource_item = create_resource_item(topic_obj['title'], 'Preparation', resource['name'])
        resource_item_list.append(resource_item)
    
    for resource in topic_obj['materials_strings']['content']:
        resource_item = create_resource_item(topic_obj['title'], 'Content', resource['name'])
        resource_item_list.append(resource_item)

    for resource in topic_obj['materials_strings']['practice']:
        resource_item = create_resource_item(topic_obj['title'], 'Practice', resource['name'])
        resource_item_list.append(resource_item)

    for resource in topic_obj['materials_strings']['assessment']:
        resource_item = create_resource_item(topic_obj['title'], 'Assessment', resource['name'])
        resource_item_list.append(resource_item)
    return '<resources>' + '\n'.join(resource_item_list) + '</resources>'

def create_topic_xml(topic_obj):
    module_item = create_learning_module(topic_obj) # contains all 4 categories
    resource_section = create_resources_section(topic_obj)
    # todo add resources section and combine with rest of the the xml file
    return'''<?xml version="1.0" encoding="UTF-8"?>
        <manifest identifier="gdef8a2d0e6c42365865975150b145ae3" xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1" xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource" xmlns:lomimscc="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/manifest" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/profile/cc/ccv1p1/ccv1p1_imscp_v1p2_v1p0.xsd http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lomresource_v1p0.xsd http://ltsc.ieee.org/xsd/imsccv1p1/LOM/manifest http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lommanifest_v1p0.xsd">
        <metadata>
            <schema>IMS Common Cartridge</schema>
            <schemaversion>1.1.0</schemaversion>
            <lomimscc:lom>
            <lomimscc:general>
                <lomimscc:title>
                <lomimscc:string>{}</lomimscc:string> <!-- course name -->
                </lomimscc:title>
            </lomimscc:general>
            <lomimscc:lifeCycle>
                <lomimscc:contribute>
                <lomimscc:date>
                    <lomimscc:dateTime>2021-04-07</lomimscc:dateTime> <!-- date created -->
                </lomimscc:date>
                </lomimscc:contribute>
            </lomimscc:lifeCycle>
            <lomimscc:rights>
                <lomimscc:copyrightAndOtherRestrictions>
                <lomimscc:value>yes</lomimscc:value>
                </lomimscc:copyrightAndOtherRestrictions>
                <lomimscc:description>
                <lomimscc:string>Private (Copyrighted) - http://en.wikipedia.org/wiki/Copyright</lomimscc:string>
                </lomimscc:description>
            </lomimscc:rights>
            </lomimscc:lom>
        </metadata>
        <organizations>
            <organization identifier="org_1" structure="rooted-hierarchy">
            <item identifier="LearningModules">
    '''.format(topic_obj['title']) + module_item + '''\n </item> 
        </organization>
    </organizations>
    ''' + resource_section +'</manifest>'
# print(create_category_item('pointers', 'preparation'))
# print(create_material_item('pointers', 'preparation', 'slide.pdf'))


# class files: 
#     def __init__(self, name, file): 
#         self.name = name 
#         self.file = file
   
# # creating list       
# list = [] 
  
# # appending instances to list 
# list.append( files('slide.pdf', 'dummy') )
# list.append( files('test1.pdf', 'dummy') )

# print(create_category('Pointers','Preparation', list))