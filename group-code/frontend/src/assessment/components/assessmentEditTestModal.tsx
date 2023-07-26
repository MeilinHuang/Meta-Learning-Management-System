import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, Select, Space, message } from 'antd';
import MarkdownEditor2 from 'common/MarkdownEditor2';
import AssessmentService from '../AssessmentService';

type AssessmentEditTestModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string | undefined;
};

const AssessmentEditTestModal = (props: AssessmentEditTestModalType) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [questionType, setQuestionType] = useState('singleChoice');

  const [form] = Form.useForm();

  const [description, setDescription] = useState('');
  const [descFullScreen, setDescFullScreen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const errorChecking = (formValues: any) => {
    if (description === '') {
      messageApi.open({
        type: 'error',
        content: 'Please enter description.'
      });
      return false;
    }
    if (questionType !== 'Essay' && formValues.choices?.length < 2) {
      messageApi.open({
        type: 'error',
        content: 'Number of choices must be greater than 1.'
      });
      return false;
    }
    if (
      questionType !== 'Essay' &&
      new Set(formValues.choices).size !== formValues.choices?.length
    ) {
      messageApi.open({
        type: 'error',
        content: 'Duplicate choices not allowed'
      });
      return false;
    }
    if (
      questionType === 'singleChoice' &&
      !formValues.choices?.includes(formValues.answer)
    ) {
      messageApi.open({
        type: 'error',
        content: 'The answer must be one of the choices.'
      });
      return false;
    }
    if (
      questionType === 'multipleChoice' &&
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
      answer: (questionType === 'singleChoice'
        ? [formValues?.answer]
        : formValues?.answer) as Array<string> | ['']
    });
    const params = {
      assessment_id: props.id,
      type: formValues.type,
      question_description: description,
      choices: choiceParam,
      answer: answerParam
    };
    console.log(params);
    try {
      const res = await AssessmentService.addNewQuestionInAssessment(params);
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

  console.log(questionType);

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
            initialValue="singleChoice"
          >
            <Select
              options={assessmentTypes}
              onChange={(value) => setQuestionType(value)}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <MarkdownEditor2
              MDContent={description}
              setMDContent={setDescription}
            />
          </Form.Item>
          {questionType !== 'Essay' && (
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
          {questionType === 'multipleChoice' && (
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
          {questionType === 'singleChoice' && (
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
