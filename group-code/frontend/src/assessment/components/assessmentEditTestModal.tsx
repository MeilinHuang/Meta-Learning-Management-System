import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, Select, Space, message } from 'antd';
import MarkdownEditor2 from 'common/MarkdownEditor2';
import AssessmentService from '../AssessmentService';

type AssessmentEditTestModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string | undefined;
  modalType: 'add' | 'edit';
  probShow: {
    type: string;
    problemDescription: string;
    questionID: string;
  };
};

const AssessmentEditTestModal = (props: AssessmentEditTestModalType) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(
    props.modalType === 'edit' ? props.probShow.type : 'singleChoice'
  );

  const [form] = Form.useForm();
  console.log(props.modalType === 'edit', props.probShow.problemDescription);
  const [description, setDescription] = useState('');
  const [descFullScreen, setDescFullScreen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (props.modalType === 'edit') {
      setDescription(props.probShow.problemDescription);
    }
  }, [props.isOpen])

  const errorChecking = (formValues: any) => {
    if (description === '') {
      messageApi.open({
        type: 'error',
        content: 'Please enter description.'
      });
      return false;
    }
    if (selectedType !== 'Essay' && formValues.choices?.length < 2) {
      messageApi.open({
        type: 'error',
        content: 'Number of choices must be greater than 1.'
      });
      return false;
    }
    if (
      selectedType !== 'Essay' &&
      new Set(formValues.choices).size !== formValues.choices?.length
    ) {
      messageApi.open({
        type: 'error',
        content: 'Duplicate choices not allowed'
      });
      return false;
    }
    if (
      selectedType === 'singleChoice' &&
      !formValues.choices?.includes(formValues.answer)
    ) {
      messageApi.open({
        type: 'error',
        content: 'The answer must be one of the choices.'
      });
      return false;
    }
    if (
      selectedType === 'multipleChoice' &&
      !formValues.answer.every((ans: string) =>
        formValues.choices.includes(ans)
      )
    ) {
      messageApi.open({
        type: 'error',
        content: 'The answers must be one of the choices.'
      });
      return false;
    }
    return true;
  };

  const handleOk = async () => {
    console.log(form.getFieldsValue());
    const formValues = form.getFieldsValue();
    if (!errorChecking(formValues)) {
      return;
    }
    const choiceParam = JSON.stringify({
      choices: formValues.choices as Array<string> | ['']
    });
    const answerParam = JSON.stringify({
      answer: (selectedType === 'singleChoice'
        ? [formValues?.answer]
        : formValues?.answer) as Array<string> | ['']
    });
    const params = {
      type: formValues.type,
      question_description: description,
      choices: choiceParam,
      answer: answerParam
    };
    console.log(params);
    try {
      let res;
      if (props.modalType === 'edit') {
        const paramsWithQuestionId = {
          ...params,
          question_id: parseInt(props.probShow.questionID)
        };
        res = await AssessmentService.updateQuestionInAssessment(
          paramsWithQuestionId
        );
      } else {
        const paramsWithAssessmentId = { ...params, assessment_id: props.id };
        res = await AssessmentService.addNewQuestionInAssessment(
          paramsWithAssessmentId
        );
      }
      console.log(res.data);
      props.setIsOpen(false);
      alert('success');
      window.location.reload();
    } catch (err) {
      messageApi.open({
        type: 'error',
        content: 'Submission failed.'
      });
    }
    console.log('Clicked cancel button');
  };

  const handleCancel = () => {
    props.setIsOpen(false);
  };

  const assessmentTypes = [
    { label: 'Single Choice', value: 'singleChoice' },
    { label: 'Multiple Choice', value: 'multipleChoice' },
    { label: 'Essay', value: 'Essay' }
  ];

  console.log(props.modalType);

  return (
    <>
      <Modal
        title="Title"
        open={props.isOpen}
        confirmLoading={confirmLoading}
        footer={[]}
        onCancel={handleCancel}
      >
        {contextHolder}
        <Form
          form={form}
          name="editTest"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
          onFinish={handleOk}
        >
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please choose type' }]}
            initialValue={selectedType}
          >
            <Select
              options={assessmentTypes}
              onChange={(value) => setSelectedType(value)}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <MarkdownEditor2
              MDContent={description}
              setMDContent={setDescription}
            />
          </Form.Item>
          {selectedType !== 'Essay' && (
            <Form.List name="choices">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        label="Choice"
                        rules={[
                          { required: true, message: 'Please enter choice' }
                        ]}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16, offset: 1 }}
                      >
                        <Input />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Choice
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}
          {selectedType === 'multipleChoice' && (
            <Form.List name="answer">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        label="Answer"
                        rules={[
                          { required: true, message: 'Please enter answer' }
                        ]}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16, offset: 1 }}
                      >
                        <Input />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Answer
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}
          {selectedType === 'singleChoice' && (
            <Form.Item
              label="Answer"
              name="answer"
              rules={[{ required: true, message: 'Please input the answer!' }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: 'rgb(79 70 229)', marginRight: '10px' }}
            >
              Submit
            </Button>
            <Button htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AssessmentEditTestModal;
